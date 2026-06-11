import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

async function getOverviewData() {
    const supabase = await createClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

    // Last 7 days for mini-chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today)
        d.setDate(d.getDate() - (6 - i))
        return d.toISOString().slice(0, 10)
    })

    const [
        { data: staffList },
        { count: totalOrders },
        { count: todayOrders },
        { data: allOrders },
        { data: monthOrders },
        { count: newOrders },
        { count: specialOrders },
        { data: recentOrders },
    ] = await Promise.all([
        supabase.from('staff_profiles').select('id, is_active'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'cancelled'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabase.from('orders').select('total_price, status').neq('status', 'cancelled'),
        supabase.from('orders').select('total_price, created_at').neq('status', 'cancelled').gte('created_at', thisMonthStart),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('special_cake_orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('orders')
            .select('id, order_number, customer_name, customer_phone, status, total_price, created_at')
            .order('created_at', { ascending: false })
            .limit(6),
    ])

    const totalRevenue = allOrders?.reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0
    const monthRevenue = monthOrders?.reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0

    // Build daily revenue for the last 7 days
    const dailyRevenue = last7Days.map(day => {
        const dayTotal = monthOrders?.filter(o => o.created_at.slice(0, 10) === day)
            .reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0
        return { day: day.slice(5), revenue: dayTotal }
    })

    // Status breakdown
    const statusBreakdown = (allOrders ?? []).reduce((acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1
        return acc
    }, {} as Record<string, number>)

    return {
        stats: {
            totalOrders:   totalOrders   ?? 0,
            todayOrders:   todayOrders   ?? 0,
            totalRevenue,
            monthRevenue,
            newOrders:     newOrders     ?? 0,
            specialOrders: specialOrders ?? 0,
            totalStaff:    staffList?.length ?? 0,
            activeStaff:   staffList?.filter(s => s.is_active).length ?? 0,
        },
        dailyRevenue,
        statusBreakdown,
        recentOrders: recentOrders ?? [],
    }
}

export default async function AdminDashboardPage() {
    const data = await getOverviewData()
    return <DashboardClient {...data} />
}