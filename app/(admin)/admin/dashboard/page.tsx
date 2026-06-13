// app/(admin)/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getOverviewData(isOwner: boolean) {
    const supabase = await createClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1).toISOString()

    const last30DaysDates = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today)
        d.setDate(d.getDate() - (29 - i))
        return { date: d.toISOString().slice(0, 10), dayLabel: d.toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' }) }
    })

    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
        return { date: d.toISOString().slice(0, 7), monthLabel: d.toLocaleDateString('ar-EG', { month: 'short' }) }
    })

    const last30DaysStart = new Date(today)
    last30DaysStart.setDate(last30DaysStart.getDate() - 29)
    const last30DaysStartISO = last30DaysStart.toISOString()

    // ✅ للـ operations: نجيب بس الـ orders والـ products
    // 🔒 للـ owner: نجيب كل حاجة
    const [
        { count: totalOrders },
        { count: todayOrders },
        { data: allOrders },
        { data: monthOrders },
        { data: last30DaysOrders },
        { count: newOrders },
        { count: specialOrders },
        { data: recentOrders },
        { data: customerProfiles },
        { data: wishlists },
        { data: orderItems },
        staffResult,
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'cancelled'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabase.from('orders').select('id, total_price, status, created_at, user_id').neq('status', 'cancelled'),
        supabase.from('orders').select('total_price, created_at').neq('status', 'cancelled').gte('created_at', thisMonthStart),
        supabase.from('orders').select('total_price, status, created_at, user_id').neq('status', 'cancelled').gte('created_at', last30DaysStartISO),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('special_cake_orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('orders').select('id, order_number, customer_name, customer_phone, customer_email, status, total_price, created_at').order('created_at', { ascending: false }).limit(6),
        // ✅ الكل يشوف العملاء (بدون تفاصيل مالية دقيقة)
        supabase.from('customer_profiles').select('id, created_at'),
        supabase.from('wishlists').select('id'),
        supabase.from('order_items').select('product_id, quantity, unit_price, order_id, products(name_ar, base_price, category_id, categories(name_ar))'),
        // 🔒 بيانات الموظفين للـ owner فقط
        isOwner
            ? supabase.from('staff_profiles').select('id, is_active')
            : Promise.resolve({ data: null }),
    ])

    const totalRevenue = allOrders?.reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0
    const monthRevenue = monthOrders?.reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0

    const last30DailyRevenue = last30DaysDates.map(dayObj => {
        const dayTotal = last30DaysOrders?.filter(o => o.created_at.slice(0, 10) === dayObj.date)
            .reduce((s, o) => s + Number(o.total_price ?? 0), 0) ?? 0
        return { day: dayObj.dayLabel, revenue: dayTotal }
    })

    const last30DailyOrders = last30DaysDates.map(dayObj => {
        const dayCount = last30DaysOrders?.filter(o => o.created_at.slice(0, 10) === dayObj.date).length ?? 0
        return { day: dayObj.dayLabel, orders: dayCount }
    })

    const statusBreakdown = (allOrders ?? []).reduce((acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1
        return acc
    }, {} as Record<string, number>)

    const totalCustomers = customerProfiles?.length ?? 0
    const customersWithOrders = new Set(allOrders?.filter(o => o.user_id).map(o => o.user_id)).size ?? 0

    const customerOrderMap = new Map<string, { totalRevenue: number; orderCount: number }>()
    allOrders?.forEach(order => {
        if (!order.user_id) return
        const existing = customerOrderMap.get(order.user_id)
        if (existing) {
            existing.totalRevenue += Number(order.total_price ?? 0)
            existing.orderCount += 1
        } else {
            customerOrderMap.set(order.user_id, { totalRevenue: Number(order.total_price ?? 0), orderCount: 1 })
        }
    })

    const topCustomers = Array.from(customerOrderMap.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10)
        .map((c, index) => ({ name: `عميل ${index + 1}`, revenue: c.totalRevenue }))

    const productSalesMap = new Map<string, { name: string | null; quantity: number; revenue: number }>()
    orderItems?.forEach(item => {
        if (!item.product_id) return
        const existing = productSalesMap.get(item.product_id)
        if (existing) {
            existing.quantity += item.quantity
            existing.revenue += item.quantity * item.unit_price
        } else {
            productSalesMap.set(item.product_id, {
                name: item.products?.name_ar ?? 'منتج',
                quantity: item.quantity,
                revenue: item.quantity * item.unit_price
            })
        }
    })

    const bestSellersList = Array.from(productSalesMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)

    const bestSellingProduct = bestSellersList[0]

    const newCustomersMonthly = last6Months.map(m => {
        const monthStart = new Date(m.date + '-01T00:00:00Z')
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
        const count = customerProfiles?.filter(c => {
            const createdAt = new Date(c.created_at)
            return createdAt >= monthStart && createdAt < monthEnd
        }).length ?? 0
        return { month: m.monthLabel, count }
    })

    const staffList = staffResult?.data ?? null
    const aov = totalOrders ? Math.round(totalRevenue / totalOrders) : 0
    const totalWishlistItems = wishlists?.length ?? 0

    return {
        stats: {
            totalOrders: totalOrders ?? 0,
            todayOrders,
            // 🔒 الإيرادات للـ owner فقط (operations يشوف 0 أو يخفي الكارت)
            totalRevenue: isOwner ? totalRevenue : null,
            monthRevenue: isOwner ? monthRevenue : null,
            newOrders,
            specialOrders,
            totalCustomers,
            customersWithOrders,
            topCustomerRevenue: isOwner ? (topCustomers[0]?.revenue ?? 0) : null,
            aov: isOwner ? aov : null,
            returningCustomers: 0,
            bestSellingProductName: bestSellingProduct?.name ?? 'N/A',
            bestSellingProductQuantity: bestSellingProduct?.quantity ?? 0,
            totalWishlistItems,
            totalStaff: staffList?.length ?? null,
            activeStaff: staffList?.filter(s => s.is_active).length ?? null,
        },
        isOwner,
        last30DaysRevenue: isOwner ? last30DailyRevenue : [],
        last30DaysOrders: last30DailyOrders,
        topCustomers: isOwner ? topCustomers : [],
        bestSellers: bestSellersList,
        newCustomersGrowth: newCustomersMonthly,
        statusBreakdown,
        recentOrders: recentOrders ?? [],
    }
}

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isOwner = ['owner', 'super_admin'].includes(staff?.role ?? '')
    const data = await getOverviewData(isOwner)

    return <DashboardClient {...data} />
}