import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, User, Phone, MapPin, Calendar, Hash } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:              { label: 'جديد',        color: 'text-blue-400 bg-blue-500/15 border-blue-500/25' },
  confirmed:        { label: 'مؤكد',        color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' },
  in_preparation:   { label: 'يُحضَّر',      color: 'text-amber-400 bg-amber-500/15 border-amber-500/25' },
  ready:            { label: 'جاهز',        color: 'text-teal-400 bg-teal-500/15 border-teal-500/25' },
  out_for_delivery: { label: 'في الطريق',   color: 'text-purple-400 bg-purple-500/15 border-purple-500/25' },
  delivered:        { label: 'تم التوصيل', color: 'text-slate-400 bg-slate-500/15 border-slate-500/25' },
  picked_up:        { label: 'استُلم',      color: 'text-slate-400 bg-slate-500/15 border-slate-500/25' },
  cancelled:        { label: 'ملغي',        color: 'text-red-400 bg-red-500/15 border-red-500/25' },
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', params.id)
    .single()

  if (!order) notFound()

  const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'text-white/40 bg-white/5 border-white/10' }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/orders"
          className="w-10 h-10 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 flex items-center justify-center transition-all">
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">تفاصيل الطلب</h1>
          <p className="text-xs text-white/40 mt-0.5 font-mono">{order.order_number}</p>
        </div>
        <span className={`mr-auto px-3 py-1.5 rounded-full text-[11px] font-bold border ${s.color}`}>
          {s.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">بيانات العميل</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">الاسم</p>
                  <p className="text-sm text-white font-semibold">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">الهاتف</p>
                  <p className="text-sm text-white font-semibold" dir="ltr">{order.customer_phone}</p>
                </div>
              </div>
              {(order as any).owner_email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">البريد الإلكتروني</p>
                    <p className="text-sm text-white font-semibold">{(order as any).owner_email}</p>
                  </div>
                </div>
              )}
              {order.delivery_address && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">عنوان التوصيل</p>
                    <p className="text-sm text-white font-semibold">{order.delivery_address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">تاريخ الطلب</p>
                  <p className="text-sm text-white font-semibold">
                    {new Date(order.created_at).toLocaleString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">ملخص الطلب</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>المجموع الفرعي</span>
                <span>{Number(order.subtotal ?? 0).toLocaleString('ar-EG')} ج</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>رسوم التوصيل</span>
                <span>{Number(order.delivery_fee ?? 0).toLocaleString('ar-EG')} ج</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-white/[0.06] pt-2 mt-2">
                <span>الإجمالي</span>
                <span className="text-[#c9a84c]">{Number(order.total_price ?? 0).toLocaleString('ar-EG')} ج</span>
              </div>
            </div>
            {order.customer_notes && (
              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">ملاحظات العميل</p>
                <p className="text-sm text-white/70">{order.customer_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
              <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">
                منتجات الطلب ({order.items?.length ?? 0})
              </h2>
            </div>
            {order.items?.length === 0 ? (
              <div className="py-12 text-center text-white/20 text-sm">لا توجد منتجات</div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{item.product_name_ar}</p>
                      {item.variant_name_ar && (
                        <p className="text-xs text-white/40 mt-0.5">{item.variant_name_ar}</p>
                      )}
                      {item.cake_text && (
                        <p className="text-xs text-[#c9a84c]/70 mt-0.5">نص: {item.cake_text}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-lg">
                        × {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-white/80 w-24 text-left">
                        {Number(item.unit_price).toLocaleString('ar-EG')} ج
                      </span>
                      <span className="text-sm font-bold text-[#c9a84c] w-24 text-left">
                        {Number(item.unit_price * item.quantity).toLocaleString('ar-EG')} ج
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}