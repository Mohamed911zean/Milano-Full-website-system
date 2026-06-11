'use client'

import Link from 'next/link'
import { ShoppingBag, TrendingUp, Clock, CakeSlice, Users, ChevronRight, ArrowUpRight } from 'lucide-react'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { cn } from '@/lib/utils'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Sector
} from 'recharts'
import { useState } from 'react'

interface Props {
    stats: {
        totalOrders: number; todayOrders: number; totalRevenue: number
        monthRevenue: number; newOrders: number; specialOrders: number
        totalStaff: number; activeStaff: number
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

function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
    return (
        <div className="h-64 w-full mt-4" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                    <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#c9a84c' }}
                        formatter={(value: any) => [`${value} ج`, 'الإيرادات']}
                        labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

function StatusDonut({ breakdown }: { breakdown: Record<string, number> }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const data = Object.entries(breakdown).map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name] ?? '#64748b'
    })).filter(d => d.value > 0);

    if (data.length === 0) return <div className="text-center text-white/20 text-xs py-8">لا توجد بيانات</div>

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 h-64 mt-4" dir="ltr">
            <div className="h-full w-full sm:w-1/2 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex as any}
                            activeShape={renderActiveShape}
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            stroke="rgba(0,0,0,0)"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-bold text-white leading-none">
                        {data.reduce((acc, cur) => acc + cur.value, 0)}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">إجمالي</p>
                </div>
            </div>
            
            <div className="flex-1 w-full flex flex-col justify-center gap-3" dir="rtl">
                {data.map((entry, index) => (
                    <div key={entry.name} 
                         className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer", 
                             activeIndex === index ? "bg-white/5" : "hover:bg-white/[0.02]"
                         )}
                         onMouseEnter={() => setActiveIndex(index)}
                    >
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: entry.color }} />
                        <span className="text-xs text-white/70 flex-1">{STATUS_LABELS_AR[entry.name] ?? entry.name}</span>
                        <span className="text-sm font-bold text-white tabular-nums">{entry.value}</span>
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
                <StatCard label="الموظفون النشطون" value={`${stats.activeStaff}/${stats.totalStaff}`}
                          sub="من إجمالي الفريق" icon={Users} accent="bg-teal-500" href="/admin/staff" />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue chart */}
                <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
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
                    <div>
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
