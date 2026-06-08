"use server"
// app/actions/admin.ts

import { createClient, createAdminClient } from '@/lib/supabase/server'

// ─── helper: تأكد إن المستخدم الحالي super_admin أو owner ───
async function requireSuperAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('غير مصرح')

    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

    if (!staff || !staff.is_active || !['owner', 'super_admin'].includes(staff.role)) {
        throw new Error('صلاحيات غير كافية')
    }

    return { supabase, user, staff }
}

// ─── إنشاء موظف جديد ─────────────────────────────────────────
export async function createStaffMember(input: {
    fullName: string
    email: string
    phone?: string
    password: string
    role: 'operations' | 'super_admin'
}): Promise<{ success: boolean; message?: string }> {
    try {
        const { user: adminUser } = await requireSuperAdmin()

        if (!input.fullName.trim())   return { success: false, message: 'الاسم مطلوب' }
        if (!input.email.trim())      return { success: false, message: 'الإيميل مطلوب' }
        if (input.password.length < 8) return { success: false, message: 'كلمة المرور 8 أحرف على الأقل' }

        // إنشاء الـ auth user بالـ admin client
        const admin = await createAdminClient()
        const { data: authData, error: authError } = await admin.auth.admin.createUser({
            email:          input.email.trim(),
            password:       input.password,
            email_confirm:  true,   // مش محتاج يأكد إيميله
        })

        if (authError) {
            if (authError.message.includes('already registered')) {
                return { success: false, message: 'الإيميل مسجل مسبقاً' }
            }
            return { success: false, message: authError.message }
        }

        if (!authData.user) return { success: false, message: 'فشل إنشاء الحساب' }

        // إنشاء الـ staff profile
        const supabase = await createClient()
        const { error: profileError } = await supabase
            .from('staff_profiles')
            .insert({
                id:         authData.user.id,
                full_name:  input.fullName.trim(),
                email:      input.email.trim(),
                phone:      input.phone?.trim() ?? null,
                role:       input.role,
                created_by: adminUser.id,
                is_active:  true,
            })

        if (profileError) {
            // امسح الـ auth user لو فشل إنشاء الـ profile
            await admin.auth.admin.deleteUser(authData.user.id)
            return { success: false, message: `فشل إنشاء الملف: ${profileError.message}` }
        }

        // سجل في الـ activity log
        await supabase.from('staff_activity_log').insert({
            staff_id:    adminUser.id,
            action:      `أنشأ حساب موظف جديد: ${input.fullName}`,
            target_type: 'staff',
            target_id:   authData.user.id,
            meta:        { role: input.role, email: input.email },
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

// ─── تفعيل / إيقاف موظف ──────────────────────────────────────
export async function toggleStaffActive(
    staffId: string,
    isActive: boolean
): Promise<{ success: boolean; message?: string }> {
    try {
        const { supabase, user: adminUser } = await requireSuperAdmin()

        // لا تقدر توقف نفسك
        if (staffId === adminUser.id) {
            return { success: false, message: 'لا يمكنك إيقاف حسابك' }
        }

        const { error } = await supabase
            .from('staff_profiles')
            .update({ is_active: isActive })
            .eq('id', staffId)

        if (error) return { success: false, message: error.message }

        await supabase.from('staff_activity_log').insert({
            staff_id:    adminUser.id,
            action:      isActive ? 'فعّل حساب موظف' : 'أوقف حساب موظف',
            target_type: 'staff',
            target_id:   staffId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

// ─── إعادة تعيين كلمة مرور موظف ─────────────────────────────
export async function resetStaffPassword(
    staffId: string,
    newPassword: string
): Promise<{ success: boolean; message?: string }> {
    try {
        if (newPassword.length < 8) return { success: false, message: 'كلمة المرور 8 أحرف على الأقل' }

        const { supabase, user: adminUser } = await requireSuperAdmin()
        const admin = await createAdminClient()

        const { error } = await admin.auth.admin.updateUserById(staffId, { password: newPassword })
        if (error) return { success: false, message: error.message }

        await supabase.from('staff_activity_log').insert({
            staff_id:    adminUser.id,
            action:      'أعاد تعيين كلمة مرور موظف',
            target_type: 'staff',
            target_id:   staffId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}