// app/(admin)/admin/dashboard/DashboardClient.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag, TrendingUp, Clock, CakeSlice, Users, ChevronRight, ArrowUpRight, Heart, Lock } from 'lucide-react'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { cn } from '@/lib/utils'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

interface DashboardStats {
    totalOrders: number
    todayOrders: number | null
    totalRevenue: number | null       // null للـ operations
    monthRevenue: number | null       // null للـ operations
    newOrders: number | null
    specialOrders: number | null
    totalCustomers: number
    customersWithOrders: number
    topCustomerRevenue: number | null // null للـ operations
    aov: number | null                // null للـ operations
    returningCustomers: number
    bestSellingProductName: string
    bestSellingProductQuantity: number
    totalWishlistItems: number
    totalStaff: number | null         // null للـ operations
    activeStaff: number | null        // null للـ operations
}

const STATUS_COLORS: Record<string, string> = {
    new: '#3b82f6', confirmed: '#10b981', in_preparation: '#f59e0b',
    ready: '#14b8a6', out_for_delivery: '#a855f7', delivered: '#64748b',
    picked_up: '#64748b', cancelled: '#ef4444',
}

const STATUS_LABELS_AR: Record<string, string> = {
    new: 'جديد', confirmed: 'مؤكد', in_preparation: 'يُحضَّر',
    ready: 'جاهز', out_for_delivery: 'في الطريق', delivered: 'تم التوصيل',
    picked_up: 'استُلم', cancelled: 'ملغي',
}

// كارت الإحصاء
function StatCard({ label, value, sub, icon: Icon, accent, href, locked = false }: {
    label: string; value: string | number | null; sub?: string
    icon: React.ElementType; accent: string; href?: string; locked?: boolean
}) {
    if (locked) {
        return (
            <div className="relative overflow-hidden bg-[#111113] border border-white/[0.04] rounded-2xl p-5 opacity-40">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', accent, 'bg-opacity-10')}>
                        <Lock className="w-5 h-5 text-white/40" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-white/20">—</p>
                <p className="text-xs text-white/20 mt-1">{label}</p>
                <p className="text-[10px] text-white/15 mt-0.5">للمالك فقط</p>
            </div>
        )
    }

    const Inner = (
        <div className={cn("relative overflow-hidden bg-[#111113] border border-white/[0.06] rounded-2xl p-5 group transition-all duration-300", href ? "hover:border-white/10 cursor-pointer hover:-translate-y-0.5" : "")}>
            <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity', accent)} />
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', accent, 'bg-opacity-10')}>
                    <Icon className="w-5 h-5 text-white/80" />
                </div>
                {href && <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />}
            </div>
            <p className="text-2xl font-bold text-white relative z-10 tabular-nums">
                {typeof value === 'number' ? value.toLocaleString('ar-EG') : value ?? '—'}
            </p>
            <p className="text-xs text-white/40 mt-1 relative z-10">{label}</p>
            {sub && <p className="text-[10px] text-white/25 mt-0.5 relative z-10">{sub}</p>}
        </div>
    )
    return href ? <Link href={href}>{Inner}</Link> : Inner
}

export default function DashboardClient({ stats, isOwner, last30DaysRevenue, last30DaysOrders, topCustomers, bestSellers, newCustomersGrowth, statusBreakdown, recentOrders }: any) {
    const statusData = Object.entries(statusBreakdown ?? {}).map(([name, value]) => ({
        name, value: value as number, color: STATUS_COLORS[name] ?? '#64748b'
    })).filter(d => d.value > 0)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── KPI Row 1: الطلبات (الكل يشوفها) ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="إجمالي الطلبات"  value={stats.totalOrders}  sub="منذ البداية"    icon={ShoppingBag} accent="bg-blue-500"    href="/admin/orders" />
                <StatCard label="طلبات اليوم"      value={stats.todayOrders}  sub="آخر 24 ساعة"  icon={TrendingUp}   accent="bg-emerald-500" />
                <StatCard label="طلبات جديدة"       value={stats.newOrders}    sub="تحتاج مراجعة" icon={Clock}        accent="bg-amber-500"   href="/admin/orders" />
                <StatCard label="كعكات مناسبات"     value={stats.specialOrders} sub="طلبات خاصة جديدة" icon={CakeSlice} accent="bg-pink-500" />
            </div>

            {/* ── KPI Row 2: إيرادات (owner فقط) ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                    label="إيرادات الشهر"
                    value={isOwner && stats.monthRevenue !== null ? `${(stats.monthRevenue / 1000).toFixed(1)}k` : null}
                    sub={isOwner && stats.monthRevenue !== null ? `${stats.monthRevenue.toLocaleString()} جنيه` : undefined}
                    icon={TrendingUp} accent="bg-[#c9a84c]"
                    locked={!isOwner}
                />
                <StatCard
                    label="الإيرادات الكلية"
                    value={isOwner && stats.totalRevenue !== null ? `${(stats.totalRevenue / 1000).toFixed(1)}k` : null}
                    sub={isOwner && stats.totalRevenue !== null ? `${stats.totalRevenue.toLocaleString()} جنيه` : undefined}
                    icon={TrendingUp} accent="bg-purple-500"
                    locked={!isOwner}
                />
                <StatCard
                    label="متوسط قيمة الطلب"
                    value={isOwner ? stats.aov : null}
                    sub={isOwner ? 'جنيه' : undefined}
                    icon={ShoppingBag} accent="bg-purple-500"
                    locked={!isOwner}
                />
                <StatCard
                    label="أعلى إيرادات عميل"
                    value={isOwner && stats.topCustomerRevenue !== null ? stats.topCustomerRevenue.toLocaleString() : null}
                    sub={isOwner ? 'جنيه' : undefined}
                    icon={TrendingUp} accent="bg-emerald-500"
                    locked={!isOwner}
                />
            </div>

            {/* ── KPI Row 3: عملاء ومنتجات ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="إجمالي العملاء"   value={stats.totalCustomers}    icon={Users}     accent="bg-blue-500"    href="/admin/customers" />
                <StatCard label="عملاء ذوو طلبات"  value={stats.customersWithOrders} icon={TrendingUp} accent="bg-[#c9a84c]" />
                <StatCard label="الأكثر مبيعاً"     value={stats.bestSellingProductName} sub={`${stats.bestSellingProductQuantity} وحدة`} icon={TrendingUp} accent="bg-[#c9a84c]" href="/admin/best-sellers" />
                <StatCard label="إجمالي المفضلة"   value={stats.totalWishlistItems} icon={Heart}     accent="bg-pink-500" />
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* مخطط الطلبات - الكل يشوفه */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white/80 mb-1">طلبات آخر 30 يوم</h3>
                    <p className="text-[10px] text-white/30 mb-4">عدد الطلبات يومياً</p>
                    <div className="h-64 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last30DaysOrders} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#c9a84c' }}
                                    formatter={(value: any) => [value, 'الطلبات']}
                                />
                                <Bar dataKey="orders" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* مخطط الإيرادات - owner فقط */}
                {isOwner ? (
                    <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-white/80 mb-1">إيرادات آخر 30 يوم</h3>
                        <p className="text-[10px] text-white/30 mb-4">بالجنيه المصري</p>
                        <div className="h-64 w-full" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={last30DaysRevenue} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                        itemStyle={{ color: '#c9a84c' }}
                                        formatter={(value: any) => [`${value} ج`, 'الإيرادات']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    // بلوك مقفول للـ operations
                    <div className="bg-[#111113] border border-white/[0.04] rounded-2xl p-5 flex flex-col items-center justify-center opacity-40 min-h-[320px]">
                        <Lock className="w-8 h-8 text-white/20 mb-3" />
                        <p className="text-sm text-white/20 font-medium">مخطط الإيرادات</p>
                        <p className="text-xs text-white/15 mt-1">متاح للمالك فقط</p>
                    </div>
                )}
            </div>

            {/* ── Row 2 Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* توزيع حالات الطلبات - الكل يشوف */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white/80 mb-1">حالة الطلبات</h3>
                    <p className="text-[10px] text-white/30 mb-4">توزيع حسب الحالة</p>
                    <div className="h-56 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="rgba(0,0,0,0)">
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {statusData.map(d => (
                            <div key={d.name} className="flex items-center gap-1.5 text-xs text-white/60">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                {STATUS_LABELS_AR[d.name] ?? d.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* أفضل 10 منتجات - الكل يشوف */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">أفضل 10 منتجات</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">حسب الكمية المباعة</p>
                        </div>
                        <Link href="/admin/best-sellers" className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] flex items-center gap-1">
                            عرض الكل <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="h-64 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bestSellers} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#c9a84c' }} formatter={(v: any) => [v, 'الكمية']} />
                                <Bar dataKey="quantity" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── أفضل عملاء - owner فقط ── */}
            {isOwner && topCustomers?.length > 0 && (
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">أفضل 10 عملاء</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">حسب الإيرادات</p>
                        </div>
                        <Link href="/admin/customers" className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] flex items-center gap-1">
                            عرض الكل <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="h-64 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCustomers} layout="vertical" margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#c9a84c' }} formatter={(v: any) => [`${v} ج`, 'الإيرادات']} />
                                <Bar dataKey="revenue" fill="#c9a84c" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── آخر الطلبات ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
                        آخر الطلبات
                    </h2>
                    <Link href="/admin/orders" className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] flex items-center gap-1">
                        عرض الكل <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
                <OrdersTable orders={recentOrders || []} currentPage={1} totalPages={1} />
            </div>
        </div>
    )
}