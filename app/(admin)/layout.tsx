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
        .select('role, is_active')
        .eq('id', user.id)
        .single()

    if (!staff || !staff.is_active || !['owner', 'super_admin'].includes(staff.role)) {
        redirect('/admin/login')
    }

    // Fetch minimal notifications for Topbar/Sidebar cleanly in parallel
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