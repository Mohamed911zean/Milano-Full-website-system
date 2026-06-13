import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { ElementType, ReactNode } from 'react'
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
  StickyNote,
  Truck,
  User,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:              { label: 'جديد',        color: 'text-blue-400 bg-blue-500/15 border-blue-500/25' },
  confirmed:        { label: 'مؤكد',        color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' },
  in_preparation:   { label: 'يُحضّر',      color: 'text-amber-400 bg-amber-500/15 border-amber-500/25' },
  ready:            { label: 'جاهز',        color: 'text-teal-400 bg-teal-500/15 border-teal-500/25' },
  out_for_delivery: { label: 'في الطريق',   color: 'text-purple-400 bg-purple-500/15 border-purple-500/25' },
  delivered:        { label: 'تم التوصيل', color: 'text-slate-400 bg-slate-500/15 border-slate-500/25' },
  picked_up:        { label: 'استُلم',      color: 'text-slate-400 bg-slate-500/15 border-slate-500/25' },
  cancelled:        { label: 'ملغي',        color: 'text-red-400 bg-red-500/15 border-red-500/25' },
}

const FULFILLMENT_LABELS: Record<string, string> = {
  delivery: 'توصيل',
  pickup: 'استلام من الفرع',
}

type OrderItem = {
  id: string
  product_name_ar: string
  variant_name_ar: string | null
  unit_price: number | string
  quantity: number
  line_total: number | string | null
  cake_text: string | null
}

type AdminOrderDetails = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  owner_email?: string | null
  delivery_address: string | null
  location_lat: number | string | null
  location_lng: number | string | null
  location_note: string | null
  fulfillment_type: string
  status: string
  subtotal: number | string
  delivery_fee: number | string
  total_price: number | string
  customer_notes: string | null
  staff_notes: string | null
  created_at: string
  updated_at: string
  confirmed_at: string | null
  delivered_at: string | null
  items: OrderItem[]
}

function money(value: number | string | null | undefined) {
  return Number(value ?? 0).toLocaleString('ar-EG')
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
        <div className="text-sm text-white font-semibold whitespace-pre-wrap break-words">{children}</div>
      </div>
    </div>
  )
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const order = data as AdminOrderDetails
  const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'text-white/40 bg-white/5 border-white/10' }
  const email = order.customer_email ?? order.owner_email ?? null
  const hasCoordinates = order.location_lat != null && order.location_lng != null
  const mapsHref = hasCoordinates
    ? `https://www.google.com/maps?q=${order.location_lat},${order.location_lng}`
    : null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out" dir="rtl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="w-10 h-10 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 flex items-center justify-center transition-all"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">تفاصيل الطلب</h1>
          <p className="text-xs text-white/40 mt-0.5 font-mono" dir="ltr">{order.order_number}</p>
        </div>
        <span className={`mr-auto px-3 py-1.5 rounded-full text-[11px] font-bold border ${s.color}`}>
          {s.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <section className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">بيانات العميل</h2>
            <InfoRow icon={User} label="الاسم">{order.customer_name}</InfoRow>
            <InfoRow icon={Phone} label="الهاتف"><span dir="ltr">{order.customer_phone}</span></InfoRow>
            {email && <InfoRow icon={Mail} label="البريد الإلكتروني">{email}</InfoRow>}
          </section>

          <section className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">التوصيل والاستلام</h2>
            <InfoRow icon={Truck} label="طريقة الاستلام">
              {FULFILLMENT_LABELS[order.fulfillment_type] ?? order.fulfillment_type}
            </InfoRow>
            {order.delivery_address && (
              <InfoRow icon={MapPin} label="العنوان / الفرع">{order.delivery_address}</InfoRow>
            )}
            {order.location_note && (
              <InfoRow icon={StickyNote} label="ملاحظة على الموقع">{order.location_note}</InfoRow>
            )}
            {mapsHref && (
              <InfoRow icon={Navigation} label="إحداثيات الخريطة">
                <a href={mapsHref} target="_blank" rel="noreferrer" className="text-[#c9a84c] hover:underline" dir="ltr">
                  {order.location_lat}, {order.location_lng}
                </a>
              </InfoRow>
            )}
          </section>

          <section className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">التوقيت</h2>
            <InfoRow icon={Calendar} label="تاريخ الطلب">
              {new Date(order.created_at).toLocaleString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </InfoRow>
            {order.confirmed_at && (
              <InfoRow icon={Calendar} label="وقت التأكيد">
                {new Date(order.confirmed_at).toLocaleString('ar-EG')}
              </InfoRow>
            )}
            {order.delivered_at && (
              <InfoRow icon={Calendar} label="وقت التسليم">
                {new Date(order.delivered_at).toLocaleString('ar-EG')}
              </InfoRow>
            )}
          </section>

          <section className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">ملخص الدفع</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>المجموع الفرعي</span>
                <span>{money(order.subtotal)} ج</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>رسوم التوصيل</span>
                <span>{money(order.delivery_fee)} ج</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-white/[0.06] pt-2 mt-2">
                <span>الإجمالي</span>
                <span className="text-[#c9a84c]">{money(order.total_price)} ج</span>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <section className="bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
              <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">
                منتجات الطلب ({order.items?.length ?? 0})
              </h2>
            </div>
            {!order.items?.length ? (
              <div className="py-12 text-center text-white/20 text-sm">لا توجد منتجات</div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {order.items.map((item) => {
                  const lineTotal = item.line_total ?? Number(item.unit_price) * item.quantity

                  return (
                    <div key={item.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white">{item.product_name_ar}</p>
                          {item.variant_name_ar && (
                            <p className="text-xs text-white/40 mt-1">{item.variant_name_ar}</p>
                          )}
                          {item.cake_text && (
                            <div className="mt-3 rounded-xl border border-[#c9a84c]/15 bg-[#c9a84c]/5 p-3">
                              <p className="text-[10px] text-[#c9a84c] font-bold mb-1">النص المكتوب على المنتج</p>
                              <p className="text-sm text-white whitespace-pre-wrap">{item.cake_text}</p>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-left shrink-0 min-w-[260px]" dir="ltr">
                          <div>
                            <p className="text-[10px] text-white/30">Qty</p>
                            <p className="text-sm text-white font-bold">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30">Unit</p>
                            <p className="text-sm text-white/80 font-bold">{money(item.unit_price)} ج</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30">Total</p>
                            <p className="text-sm text-[#c9a84c] font-bold">{money(lineTotal)} ج</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-4 h-4 text-[#c9a84c]" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">ملاحظات العميل</h2>
              </div>
              <p className="text-sm text-white/80 whitespace-pre-wrap min-h-16">
                {order.customer_notes || 'لا توجد ملاحظات من العميل'}
              </p>
            </div>
            <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#c9a84c]" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">ملاحظات الإدارة</h2>
              </div>
              <p className="text-sm text-white/80 whitespace-pre-wrap min-h-16">
                {order.staff_notes || 'لا توجد ملاحظات داخلية'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
