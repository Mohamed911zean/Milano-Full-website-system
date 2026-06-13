'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, Bell, Package, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveOrder {
    id: string
    order_number: string
    customer_name: string
    customer_phone: string
    status: string
    total_price: number
    created_at: string
    isNewEvent?: boolean
}

const STATUS_COLORS: Record<string, string> = {
    new:              'text-blue-400 bg-blue-400/10 border-blue-400/20',
    confirmed:        'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    in_preparation:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
    ready:            'text-teal-400 bg-teal-400/10 border-teal-400/20',
    out_for_delivery: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    delivered:        'text-slate-400 bg-slate-400/10 border-slate-400/20',
    picked_up:        'text-slate-400 bg-slate-400/10 border-slate-400/20',
    cancelled:        'text-red-400 bg-red-400/10 border-red-400/20',
}

const STATUS_LABELS_AR: Record<string, string> = {
    new: 'جديد', confirmed: 'مؤكد', in_preparation: 'يُحضَّر',
    ready: 'جاهز', out_for_delivery: 'في الطريق', delivered: 'تم التوصيل',
    picked_up: 'استُلم', cancelled: 'ملغي',
}

export default function LiveOrdersClient({ initialOrders }: { initialOrders: LiveOrder[] }) {
    const [orders, setOrders] = useState<LiveOrder[]>(initialOrders)
    const [toast, setToast] = useState<{ id: string; message: string; type: 'new' | 'update' } | null>(null)

    const [supabase] = useState(() => createClient())

    const showToast = useCallback((id: string, message: string, type: 'new' | 'update') => {
        setToast({ id, message, type })
        setTimeout(() => setToast(null), 4000)
    }, [])

    const removeHighlight = useCallback((id: string) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, isNewEvent: false } : o))
    }, [])

    useEffect(() => {

        const channel = supabase
            .channel('live-orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    const newOrder = payload.new as LiveOrder
                    setOrders(prev => [{ ...newOrder, isNewEvent: true }, ...prev])
                    showToast(newOrder.id, `طلب جديد: ${newOrder.customer_name}`, 'new')
                    setTimeout(() => removeHighlight(newOrder.id), 5000)
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    const updatedOrder = payload.new as LiveOrder
                    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...updatedOrder, isNewEvent: true } : o))
                    showToast(updatedOrder.id, `تحديث حالة طلب: ${updatedOrder.order_number}`, 'update')
                    setTimeout(() => removeHighlight(updatedOrder.id), 5000)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [removeHighlight, showToast, supabase])

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative z-10">
                        <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    {/* Live pulse indicator */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0a0b] z-20 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">الطلبات المباشرة</h2>
                    <p className="text-xs text-white/40 mt-0.5">مراقبة حية للطلبات بدون الحاجة لتحديث الصفحة</p>
                </div>
            </div>

            {/* Live Orders Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orders.map((order) => (
                    <Link
                        href={`/admin/orders/${order.id}`}
                        key={order.id} 
                        className={cn(
                            "relative overflow-hidden bg-[#111113] border rounded-2xl p-4 transition-all duration-500 block",
                            order.isNewEvent 
                                ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] -translate-y-1" 
                                : "border-white/[0.06] hover:border-white/10"
                        )}
                    >
                        {/* New Event Glow */}
                        {order.isNewEvent && (
                            <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
                        )}
                        
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-[10px] text-white/30 mb-0.5">{new Date(order.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
                                <h3 className="text-sm font-bold text-white">{order.order_number}</h3>
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                STATUS_COLORS[order.status] ?? STATUS_COLORS['new']
                            )}>
                                {STATUS_LABELS_AR[order.status] ?? order.status}
                            </span>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-xs text-white/70">
                                <Users className="w-3.5 h-3.5 text-[#c9a84c]" />
                                <span className="truncate">{order.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/70">
                                <ShoppingBag className="w-3.5 h-3.5 text-[#c9a84c]" />
                                <span className="font-bold tabular-nums">{Number(order.total_price).toLocaleString()} ج</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Custom Toast Popup */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
                    <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md",
                        toast.type === 'new' 
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    )}>
                        {toast.type === 'new' ? <Package className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        <span className="text-sm font-bold">{toast.message}</span>
                    </div>
                </div>
            )}
            
            {orders.length === 0 && (
                <div className="text-center py-20 text-white/20 text-sm bg-[#111113] border border-white/[0.06] rounded-2xl">
                    لا يوجد طلبات حالياً
                </div>
            )}
        </div>
    )
}
