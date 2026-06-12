'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Search, Filter, ChevronDown, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { adminUpdateOrderStatus } from '@/app/actions/admin_orders'
import Link from 'next/link'

export interface Order {
    id: string
    order_number: string
    customer_name: string
    customer_phone: string
    customer_email: string | null
    status: string
    total_price: number
    fulfillment_type?: string
    created_at: string
}

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    new:              { label: 'جديد',        color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    confirmed:        { label: 'مؤكد',        color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    in_preparation:   { label: 'يُحضَّر',      color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    ready:            { label: 'جاهز',        color: 'bg-teal-500/15 text-teal-400 border-teal-500/25' },
    out_for_delivery: { label: 'في الطريق',   color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
    delivered:        { label: 'تم التوصيل', color: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
    picked_up:        { label: 'استُلم',      color: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
    cancelled:        { label: 'ملغي',        color: 'bg-red-500/15 text-red-400 border-red-500/25' },
}

const ALL_STATUSES = Object.keys(STATUS_LABELS)

// تـعـديـل هـنـا: إعطاء orders قيمة افتراضية [] لحماية الشاشة من الانهيار
export function OrdersTable({ orders = [], currentPage = 1, totalPages = 1 }: { orders?: Order[], currentPage?: number, totalPages?: number }) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showFilter, setShowFilter] = useState(false)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleStatusUpdate = async (id: string, newStatus: string, orderNumber: string) => {
        setLoadingId(id)
        const res = await adminUpdateOrderStatus(id, newStatus, orderNumber)
        if (!res.success) {
            alert(res.message)
        }
        setLoadingId(null)
        router.refresh()
    }

    const filtered = useMemo(() => {
        // تـعـديـل هـنـا: التأكد من أن الـ orders مصفوفة قبل عمل الـ filter
        if (!Array.isArray(orders)) return [];
        
        return orders.filter(o => {
            if (!o) return false;
            const matchStatus = statusFilter === 'all' || o.status === statusFilter
            const q = search.toLowerCase()
            const matchSearch = !q
                || (o.customer_name && o.customer_name.toLowerCase().includes(q))
                || (o.order_number && o.order_number.toLowerCase().includes(q))
                || (o.customer_phone && o.customer_phone.includes(q))
            return matchStatus && matchSearch
        })
    }, [orders, search, statusFilter])

    return (
        <div className="space-y-4" dir="rtl">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="ابحث باسم العميل أو رقم الطلب..."
                        className="w-full h-11 bg-[#111113] border border-white/[0.06] rounded-xl pr-11 pl-4 text-sm text-white placeholder:text-white/25 focus:border-[#c9a84c]/40 outline-none transition-all"
                    />
                </div>

                {/* Status filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={cn(
                            "h-11 px-4 flex items-center gap-2 rounded-xl border text-sm font-bold transition-all",
                            statusFilter !== 'all'
                                ? "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]"
                                : "bg-[#111113] border-white/[0.06] text-white/50 hover:text-white hover:border-white/10"
                        )}>
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">{statusFilter === 'all' ? 'كل الحالات' : STATUS_LABELS[statusFilter]?.label}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showFilter && "rotate-180")} />
                    </button>

                    {showFilter && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowFilter(false)} />
                            <div className="absolute left-0 top-14 z-20 bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl p-2 min-w-[180px]">
                                <button
                                    onClick={() => { setStatusFilter('all'); setShowFilter(false) }}
                                    className={cn("w-full text-right px-3 py-2 rounded-xl text-sm transition-all", statusFilter === 'all' ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-white/50 hover:text-white hover:bg-white/5")}>
                                    الكل
                                </button>
                                {ALL_STATUSES.map(s => (
                                    <button key={s}
                                        onClick={() => { setStatusFilter(s); setShowFilter(false) }}
                                        className={cn("w-full text-right px-3 py-2 rounded-xl text-sm transition-all", statusFilter === s ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-white/50 hover:text-white hover:bg-white/5")}>
                                        {STATUS_LABELS[s]?.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Count */}
            <p className="text-xs text-white/30">
                {filtered.length === orders.length
                    ? `${orders.length} طلب`
                    : `${filtered.length} من ${orders.length} طلب`}
            </p>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-white/20 text-sm bg-[#111113] rounded-2xl border border-white/[0.06]">
                    لا توجد طلبات مطابقة
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-[160px_1fr_130px_100px_90px] gap-3 px-5 py-3.5 border-b border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-white/20">
                            <span>رقم الطلب</span>
                            <span>العميل</span>
                            <span>الحالة</span>
                            <span>المبلغ</span>
                            <span>التاريخ</span>
                        </div>
                        {filtered.map((order, i) => {
                            const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-white/5 text-white/40 border-white/10' }
                            return (
                                <div key={order.id}
                                     className={cn('grid grid-cols-[160px_1fr_130px_100px_90px] gap-3 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors',
                                         i < filtered.length - 1 && 'border-b border-white/[0.03]'
                                     )}>
                                    <span className="text-xs font-mono text-[#c9a84c]/80 font-bold">{order.order_number}</span>
                                    <div>
                                        <p className="text-sm font-medium text-white/80 truncate">{order.customer_name}</p>
                                        <div className="flex flex-col gap-1 mt-0.5">
                                            <p className="text-[10px] text-white/30 font-mono">{order.customer_phone}</p>
                                            {order.customer_email && <p className="text-[10px] text-white/30 truncate">{order.customer_email}</p>}
                                        </div>
                                    </div>
                                    <div className="relative w-fit">
                                        <select
                                            value={order.status}
                                            disabled={loadingId === order.id}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value, order.order_number)}
                                            className={cn('appearance-none pr-3 pl-8 py-1 rounded-full text-[10px] font-bold border outline-none cursor-pointer', s.color)}
                                        >
                                            {ALL_STATUSES.map(st => (
                                                <option key={st} value={st} className="bg-[#1a1a1c] text-white">{STATUS_LABELS[st]?.label}</option>
                                            ))}
                                        </select>
                                        {loadingId === order.id ? (
                                            <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-current" />
                                        ) : (
                                            <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-white/80">{Number(order.total_price).toLocaleString()} ج</span>
                                    <span className="text-[10px] text-white/25">{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {filtered.map(order => {
                            const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-white/5 text-white/40 border-white/10' }
                            return (
                                <div key={order.id} className="bg-[#111113] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-bold text-white">{order.customer_name}</p>
                                            <div className="flex flex-col gap-1 mt-0.5">
                                                <p className="text-xs text-white/40 font-mono">{order.customer_phone}</p>
                                                {order.customer_email && <p className="text-[10px] text-white/30 truncate">{order.customer_email}</p>}
                                            </div>
                                        </div>
                                        <div className="relative shrink-0">
                                            <select
                                                value={order.status}
                                                disabled={loadingId === order.id}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value, order.order_number)}
                                                className={cn('appearance-none pr-3 pl-8 py-1 rounded-full text-[10px] font-bold border outline-none cursor-pointer', s.color)}
                                            >
                                                {ALL_STATUSES.map(st => (
                                                    <option key={st} value={st} className="bg-[#1a1a1c] text-white">{STATUS_LABELS[st]?.label}</option>
                                                ))}
                                            </select>
                                            {loadingId === order.id ? (
                                                <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-current" />
                                            ) : (
                                                <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                                            <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-[#c9a84c]/80 font-bold hover:text-[#c9a84c] transition-colors hover:underline">
                                                    {order.order_number}
                                            </Link>
                                    <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-white">{Number(order.total_price).toLocaleString()} ج</span>
                                            <span className="text-[10px] text-white/30">{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <button
                                onClick={() => router.push(`?page=${currentPage - 1}`)}
                                disabled={currentPage <= 1}
                                className="flex items-center gap-1 text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" /> السابق
                            </button>
                            <span className="text-sm text-white/50 font-mono">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => router.push(`?page=${currentPage + 1}`)}
                                disabled={currentPage >= totalPages}
                                className="flex items-center gap-1 text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                التالي <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}