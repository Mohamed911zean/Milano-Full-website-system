'use client'

import Link from 'next/link'
import { ShoppingBag, TrendingUp, Clock, CakeSlice, LifeBuoy, Users, ChevronRight, ArrowUpRight } from 'lucide-react'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { cn } from '@/lib/utils'

interface Props {
    stats: {
        totalOrders: number; todayOrders: number; totalRevenue: number
        monthRevenue: number; newOrders: number; specialOrders: number
        openTickets: number; totalStaff: number; activeStaff: number
    }
    dailyRevenue: { day: string; revenue: number }[]
    statusBreakdown: Record<string, number>
    recentOrders: {
        id: string; order_number: string; customer_name: string; customer_phone: string
        status: string; total_price: number; created_at: string
    }[]
}

const STATUS_COLORS: Record<string, string> = {
    new:              '#3b82f6',
    confirmed:        '#10b981',
    in_preparation:   '#f59e0b',
    ready:            '#14b8a6',
    out_for_delivery: '#a855f7',
    delivered:        '#64748b',
    picked_up:        '#64748b',
    cancelled:        '#ef4444',
}

const STATUS_LABELS_AR: Record<string, string> = {
    new: 'جديد', confirmed: 'مؤكد', in_preparation: 'يُحضَّر',
    ready: 'جاهز', out_for_delivery: 'في الطريق', delivered: 'تم التوصيل',
    picked_up: 'استُلم', cancelled: 'ملغي',
}

// Pure CSS bar chart for daily revenue
function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
    const max = Math.max(...data.map(d => d.revenue), 1)
    return (
        <div className="flex items-end gap-2 h-32 w-full">
            {data.map((d, i) => {
                const pct = (d.revenue / max) * 100
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a1c] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {d.revenue.toLocaleString()} ج
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-700"
                             style={{
                                 height: `${Math.max(pct, 4)}%`,
                                 background: pct > 50
                                     ? 'linear-gradient(to top, rgba(201,168,76,0.2), rgba(201,168,76,0.6))'
                                     : 'rgba(255,255,255,0.06)',
                                 boxShadow: pct > 50 ? '0 0 10px rgba(201,168,76,0.15)' : 'none'
                             }} />
                        <span className="text-[9px] text-white/25">{d.day}</span>
                    </div>
                )
            })}
        </div>
    )
}

// Donut-style status breakdown using CSS conic-gradient
function StatusDonut({ breakdown }: { breakdown: Record<string, number> }) {
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0)
    if (total === 0) return <div className="text-center text-white/20 text-xs py-8">لا توجد بيانات</div>

    // Build conic gradient
    let cumulativePct = 0
    const segments = Object.entries(breakdown).map(([status, count]) => {
        const pct = (count / total) * 100
        const start = cumulativePct
        cumulativePct += pct
        return { status, count, pct, start }
    })

    const gradientStops = segments.map(s =>
        `${STATUS_COLORS[s.status] ?? '#64748b'} ${s.start.toFixed(1)}% ${(s.start + s.pct).toFixed(1)}%`
    ).join(', ')

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Donut */}
            <div className="shrink-0 relative w-28 h-28">
                <div className="w-28 h-28 rounded-full"
                     style={{ background: `conic-gradient(${gradientStops})` }} />
                <div className="absolute inset-3 bg-[#111113] rounded-full flex flex-col items-center justify-center">
                    <p className="text-lg font-bold text-white">{total}</p>
                    <p className="text-[9px] text-white/30">إجمالي</p>
                </div>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1">
                {segments.map(s => (
                    <div key={s.status} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[s.status] ?? '#64748b' }} />
                        <span className="text-[10px] text-white/40 truncate">{STATUS_LABELS_AR[s.status] ?? s.status}</span>
                        <span className="text-[10px] text-white/60 font-bold mr-auto">{s.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StatCard({ label, value, sub, icon: Icon, accent, href }: {
    label: string; value: string | number; sub?: string
    icon: React.ElementType; accent: string; href?: string
}) {
    const Inner = (
        <div className={cn("relative overflow-hidden bg-[#111113] border border-white/[0.06] rounded-2xl p-5 group transition-all duration-300",
            href ? "hover:border-white/10 cursor-pointer hover:-translate-y-0.5" : "")}>
            <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity', accent)} />
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', accent, 'bg-opacity-10')}>
                    <Icon className="w-5 h-5 text-white/80" />
                </div>
                {href && <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />}
            </div>
            <p className="text-2xl font-bold text-white relative z-10 tabular-nums">
                {typeof value === 'number' ? value.toLocaleString('ar-EG') : value}
            </p>
            <p className="text-xs text-white/40 mt-1 relative z-10">{label}</p>
            {sub && <p className="text-[10px] text-white/25 mt-0.5 relative z-10">{sub}</p>}
        </div>
    )
    return href ? <Link href={href}>{Inner}</Link> : Inner
}

export default function DashboardClient({ stats, dailyRevenue, statusBreakdown, recentOrders }: Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── KPI Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="إجمالي الطلبات" value={stats.totalOrders}
                          sub="منذ البداية" icon={ShoppingBag} accent="bg-blue-500" href="/admin/orders" />
                <StatCard label="طلبات اليوم" value={stats.todayOrders}
                          sub="آخر 24 ساعة" icon={TrendingUp} accent="bg-emerald-500" />
                <StatCard label="إيرادات الشهر" value={`${(stats.monthRevenue / 1000).toFixed(1)}k`}
                          sub={`${stats.monthRevenue.toLocaleString()} جنيه`} icon={TrendingUp} accent="bg-[#c9a84c]" />
                <StatCard label="الإيرادات الكلية" value={`${(stats.totalRevenue / 1000).toFixed(1)}k`}
                          sub={`${stats.totalRevenue.toLocaleString()} جنيه`} icon={TrendingUp} accent="bg-purple-500" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="طلبات جديدة" value={stats.newOrders}
                          sub="تحتاج مراجعة" icon={Clock} accent="bg-amber-500" href="/admin/orders" />
                <StatCard label="كيكات مناسبات" value={stats.specialOrders}
                          sub="طلبات خاصة جديدة" icon={CakeSlice} accent="bg-pink-500" />
                <StatCard label="تذاكر مفتوحة" value={stats.openTickets}
                          sub="دعم فني" icon={LifeBuoy} accent="bg-red-500" />
                <StatCard label="الموظفون النشطون" value={`${stats.activeStaff}/${stats.totalStaff}`}
                          sub="من إجمالي الفريق" icon={Users} accent="bg-teal-500" href="/admin/staff" />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Revenue chart */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">إيرادات آخر 7 أيام</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">بالجنيه المصري</p>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold text-[#c9a84c] tabular-nums">{stats.monthRevenue.toLocaleString()}</p>
                            <p className="text-[10px] text-white/30">هذا الشهر</p>
                        </div>
                    </div>
                    <RevenueChart data={dailyRevenue} />
                </div>

                {/* Status donut */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="mb-5">
                        <h3 className="text-sm font-bold text-white/80">توزيع الطلبات</h3>
                        <p className="text-[10px] text-white/30 mt-0.5">حسب الحالة</p>
                    </div>
                    <StatusDonut breakdown={statusBreakdown} />
                </div>
            </div>

            {/* ── Recent Orders ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
                        آخر الطلبات
                    </h2>
                    <Link href="/admin/orders"
                          className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors flex items-center gap-1">
                        عرض الكل <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
                <OrdersTable orders={recentOrders} />
            </div>
        </div>
    )
}
