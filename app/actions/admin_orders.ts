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

    if (!staff || !staff.is_active || !['owner', 'super_admin', 'operations'].includes(staff.role)) {
        throw new Error('صلاحيات غير كافية')
    }

    return { supabase, user, staff }
}

export async function adminUpdateOrderStatus(orderId: string, status: string, orderNumber: string) {
    try {
        const { supabase, user } = await requireSuperAdmin()
        
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

        if (error) throw error

        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `قام بتحديث حالة الطلب ${orderNumber} إلى ${status}`,
            target_type: 'order',
            target_id: orderId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}
