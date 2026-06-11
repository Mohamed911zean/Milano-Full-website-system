'use server'

import { createClient } from '@/lib/supabase/server'

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

export interface CategoryInput {
    name_ar: string
    name_en?: string | null
    image_url?: string | null
    sort_order: number
    is_active: boolean
}

export async function adminCreateCategory(input: CategoryInput) {
    try {
        const { supabase, user } = await requireSuperAdmin()
        
        const { data, error } = await supabase
            .from('categories')
            .insert({
                name_ar: input.name_ar,
                name_en: input.name_en,
                image_url: input.image_url,
                sort_order: input.sort_order,
                is_active: input.is_active,
            })
            .select('id')
            .single()

        if (error) throw error

        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `أضاف قسم جديد: ${input.name_ar}`,
            target_type: 'category',
            target_id: data.id,
        })

        return { success: true, categoryId: data.id }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

export async function adminUpdateCategory(categoryId: string, input: CategoryInput) {
    try {
        const { supabase, user } = await requireSuperAdmin()
        
        const { error } = await supabase
            .from('categories')
            .update({
                name_ar: input.name_ar,
                name_en: input.name_en,
                image_url: input.image_url,
                sort_order: input.sort_order,
                is_active: input.is_active,
            })
            .eq('id', categoryId)

        if (error) throw error

        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `عدّل بيانات قسم: ${input.name_ar}`,
            target_type: 'category',
            target_id: categoryId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

export async function adminDeleteCategory(categoryId: string, categoryName: string) {
    try {
        const { supabase, user } = await requireSuperAdmin()
        
        // Check if there are products in this category
        const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryId)

        if (countError) throw countError
        if (count && count > 0) {
            return { success: false, message: 'لا يمكن حذف القسم لوجود منتجات تابعة له' }
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId)

        if (error) throw error

        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `حذف قسم: ${categoryName}`,
            target_type: 'category',
            target_id: categoryId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}
