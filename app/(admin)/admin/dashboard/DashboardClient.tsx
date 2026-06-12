'use client'

import Link from 'next/link'
import { ShoppingBag, TrendingUp, Clock, CakeSlice, Users, ChevronRight, ArrowUpRight, Heart } from 'lucide-react'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { cn } from '@/lib/utils'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Sector
} from 'recharts'
import { useState } from 'react'

interface DashboardStats {
    totalOrders: number
    todayOrders: number
    totalRevenue: number
    monthRevenue: number
    newOrders: number
    specialOrders: number
    totalStaff: number
    activeStaff: number
    totalCustomers: number
    customersWithOrders: number
    topCustomerRevenue: number
    aov: number
    returningCustomers: number
    bestSellingProductName: string
    bestSellingProductQuantity: number
    totalWishlistItems: number
}

const STATUS_COLORS: Record<string, string> = {
    new: '#3b82f6',
    confirmed: '#10b981',
    in_preparation: '#f59e0b',
    ready: '#14b8a6',
    out_for_delivery: '#a855f7',
    delivered: '#64748b',
    picked_up: '#64748b',
    cancelled: '#ef4444',
}

const STATUS_LABELS_AR: Record<string, string> = {
    new: 'جديد', confirmed: 'مؤكد', in_preparation: 'يُحضَّر',
    ready: 'جاهز', out_for_delivery: 'في الطريق', delivered: 'تم التوصيل',
    picked_up: 'استُلم', cancelled: 'ملغي',
}

function StatCard({ label, value, sub, icon: Icon, accent, href }: {
    label: string
    value: string | number
    sub?: string
    icon: React.ElementType
    accent: string
    href?: string
}) {
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
                {typeof value === 'number' ? value.toLocaleString('ar-EG') : value}
            </p>
            <p className="text-xs text-white/40 mt-1 relative z-10">{label}</p>
            {sub && <p className="text-[10px] text-white/25 mt-0.5 relative z-10">{sub}</p>}
        </div>
    )
    return href ? <Link href={href}>{Inner}</Link> : Inner
}

export default function DashboardClient({ stats, last30DaysRevenue, last30DaysOrders, topCustomers, bestSellers, newCustomersGrowth, statusBreakdown, recentOrders }: any) {

    // Prepare status data for pie chart
    const statusData = Object.entries(statusBreakdown ?? {}).map(([name, value]) => ({
        name, value: value as number, color: STATUS_COLORS[name] ?? '#64748b'
    })).filter(d => d.value > 0)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* KPI Grid 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="إجمالي الطلبات" value={stats.totalOrders} sub="منذ البداية" icon={ShoppingBag} accent="bg-blue-500" href="/admin/orders" />
                <StatCard label="طلبات اليوم" value={stats.todayOrders} sub="آخر 24 ساعة" icon={TrendingUp} accent="bg-emerald-500" />
                <StatCard label="إيرادات الشهر" value={`${(stats.monthRevenue / 1000).toFixed(1)}k`} sub={`${stats.monthRevenue.toLocaleString()} جنيه`} icon={TrendingUp} accent="bg-[#c9a84c]" />
                <StatCard label="الإيرادات الكلية" value={`${(stats.totalRevenue / 1000).toFixed(1)}k`} sub={`${stats.totalRevenue.toLocaleString()} جنيه`} icon={TrendingUp} accent="bg-purple-500" />
            </div>

            {/* KPI Grid 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="إجمالي العملاء" value={stats.totalCustomers} icon={Users} accent="bg-blue-500" href="/admin/customers" />
                <StatCard label="العملاء ذوو طلبات" value={stats.customersWithOrders} sub="من إجمالي العملاء" icon={TrendingUp} accent="bg-[#c9a84c]" />
                <StatCard label="أعلى إيرادات عميل" value={stats.topCustomerRevenue.toLocaleString()} sub="جنيه" icon={TrendingUp} accent="bg-emerald-500" />
                <StatCard label="متوسط قيمة الطلب" value={stats.aov.toLocaleString()} sub="جنيه" icon={ShoppingBag} accent="bg-purple-500" />
            </div>

            {/* KPI Grid3 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="المنتج الأكثر مبيعاً" value={stats.bestSellingProductName} sub={`${stats.bestSellingProductQuantity} وحدة`} icon={TrendingUp} accent="bg-[#c9a84c]" href="/admin/best-sellers" />
                <StatCard label="إجمالي المفضلة" value={stats.totalWishlistItems} icon={Heart} accent="bg-pink-500" />
                <StatCard label="طلبات جديدة" value={stats.newOrders} sub="تحتاج مراجعة" icon={Clock} accent="bg-amber-500" href="/admin/orders" />
                <StatCard label="كعكات مناسبات" value={stats.specialOrders} sub="طلبات خاصة جديدة" icon={CakeSlice} accent="bg-pink-500" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue last 30 days */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">إيرادات آخر 30 يوم</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">بالجنيه المصري</p>
                        </div>
                    </div>
                    <div className="h-64 w-full mt-4" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={last30DaysRevenue} margin={{ top:10, right:0, left:-20, bottom:0 }}>
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
                                    formatter={(value) => [`${value} ج`, 'الإيرادات']}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders last 30 days */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">طلبات آخر 30 يوم</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">عدد الطلبات يومياً</p>
                        </div>
                    </div>
                    <div className="h-64 w-full mt-4" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last30DaysOrders} margin={{ top:10, right:0, left:-20, bottom:0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#c9a84c' }}
                                    formatter={(value) => [value, 'الطلبات']}
                                />
                                <Bar dataKey="orders" fill="#c9a84c" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Customers */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">أفضل 10 عملاء</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">حسب الإيرادات</p>
                        </div>
                        <Link href="/admin/customers" className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors flex items-center gap-1">عرض الكل <ChevronRight className="w-3 h-3" /></Link>
                    </div>
                    <div className="h-64 w-full mt-4" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCustomers} layout="vertical" margin={{ top:10, right:0, left:20, bottom:0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#c9a84c' }}
                                    formatter={(value) => [`${value} ج`, 'الإيرادات']}
                                />
                                <Bar dataKey="revenue" fill="#c9a84c" radius={[0,4,4,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">حالة الطلبات</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">توزيع حسب الحالة</p>
                        </div>
                    </div>
                    <div className="h-64 w-full mt-4" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="rgba(0,0,0,0)"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {statusData.map((d) => (
                            <div key={d.name} className="flex items-center gap-2 text-xs text-white/70">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                {STATUS_LABELS_AR[d.name] ?? d.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Best Sellers & New Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Best Sellers */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">أفضل 10 منتجات</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">حسب الكمية المباعة</p>
                        </div>
                        <Link href="/admin/best-sellers" className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors flex items-center gap-1">عرض الكل <ChevronRight className="w-3 h-3" /></Link>
                    </div>
                    <div className="h-64 w-full mt-4" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bestSellers} margin={{ top:10, right:0, left:20, bottom:0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#c9a84c' }}
                                    formatter={(value) => [value, 'الكمية']}
                                />
                                <Bar dataKey="quantity" fill="#c9a84c" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* New Customers Growth */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/80">نمو العملاء الجدد</h3>
                            <p className="text-[10px] text-white/30 mt-0.5">آخر 6 أشهر</p>
                        </div>
                    </div>
                    <div className="h-64 w-full mt-4" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={newCustomersGrowth} margin={{ top:10, right:0, left:-20, bottom:0 }}>
                                <defs>
                                    <linearGradient id="colorNC" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#6366f1' }}
                                    formatter={(value) => [value, 'عملاء جدد']}
                                />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorNC)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
                        آخر الطلبات
                    </h2>
                    <Link href="/admin/orders" className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors flex items-center gap-1">عرض الكل <ChevronRight className="w-3 h-3" /></Link>
                </div>
                <OrdersTable orders={recentOrders} />
            </div>
        </div>
    )
}
