// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role, is_active, full_name')
        .eq('id', user.id)
        .single()

    // ✅ السماح لـ owner و super_admin و operations
    if (!staff || !staff.is_active || !['owner', 'super_admin', 'operations'].includes(staff.role)) {
        redirect('/admin/login')
    }

    const [
        { count: newOrders },
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    ])

    const currentUser = {
        email: user.email,
        staffData: staff
    }

    const notifications = {
        newOrders: newOrders ?? 0,
    }

    return (
        <AdminLayoutClient currentUser={currentUser} notifications={notifications}>
            {children}
        </AdminLayoutClient>
    )
}