// app/(admin)/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './client'

async function getDashboardData() {
    const supabase = await createClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

    const [
        { data: currentUser },
        { data: staffList },
        { count: totalOrders },
        { count: todayOrders },
        { data: revenueData },
        { data: monthRevenueData },
        { count: newOrders },
        { count: specialOrders },
        { count: openTickets },
        { data: recentOrders },
        { data: activityLog },
    ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('staff_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'cancelled'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabase.from('orders').select('total_price').neq('status', 'cancelled'),
        supabase.from('orders').select('total_price').neq('status', 'cancelled').gte('created_at', thisMonthStart),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('special_cake_orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('orders').select('id, order_number, customer_name, customer_phone, status, total_price, created_at').order('created_at', { ascending: false }).limit(8),
        supabase.from('staff_activity_log').select('*, staff:staff_profiles(full_name, role)').order('created_at', { ascending: false }).limit(20),
    ])

    const { data: staffData } = await supabase
        .from('staff_profiles')
        .select('role, is_active, id')
        .eq('id', currentUser.user?.id ?? '')
        .single()

    if (!staffData || !['owner', 'super_admin'].includes(staffData.role)) {
        redirect('/admin/login')
    }

    const totalRevenue = revenueData?.reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0
    const monthRevenue = monthRevenueData?.reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0

    return {
        currentUser: { ...currentUser.user, staffData },
        stats: {
            totalOrders:   totalOrders  ?? 0,
            todayOrders:   todayOrders  ?? 0,
            totalRevenue,
            monthRevenue,
            newOrders:     newOrders    ?? 0,
            specialOrders: specialOrders ?? 0,
            openTickets:   openTickets  ?? 0,
            totalStaff:    staffList?.length ?? 0,
            activeStaff:   staffList?.filter(s => s.is_active).length ?? 0,
        },
        staffList: staffList ?? [],
        recentOrders: recentOrders ?? [],
        activityLog: activityLog ?? [],
    }
}

export default async function AdminDashboardPage() {
    const data = await getDashboardData()
    return <AdminDashboardClient {...data} />
}