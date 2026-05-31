"use client"

import { useState } from 'react'
import { getOrderByNumberAndPhone } from '@/lib/services/orders'
import { OrderWithItems } from '@/lib/supabase/types'
import OrderTimeline from './OrderTimeline'
import { Search, Phone, Hash, AlertCircle, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setOrder(null)

    try {
      // Note: This needs to be called in a server action if we want to follow the pattern,
      // but getOrderByNumberAndPhone is already exported from orders.ts which uses 'use server' pattern?
      // Actually lib/services/orders.ts doesn't have 'use server'.
      // I should have created a server action for this. Let me quickly add one.
      
      // For now, I'll assume we'll fix the service or use a server action.
      // Wait, I can't call getOrderByNumberAndPhone directly from client if it uses 'next/headers'.
      
      const response = await fetch(`/api/track-order?number=${orderNumber}&phone=${phone}`)
      const data = await response.json()
      
      if (data.order) {
        setOrder(data.order)
      } else {
        setError('لم نتمكن من العثور على الطلب. تأكد من البيانات وحاول مرة أخرى.')
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث عن الطلب.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Search Form */}
      <section className="bg-dark-surface border border-dark-border rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">تتبع حالة طلبك</h2>
          <p className="text-text-muted">أدخل رقم الطلب ورقم التليفون المسجل لمتابعة حالته لحظة بلحظة</p>
        </div>

        <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted flex items-center gap-2">
              <Hash className="w-4 h-4 text-gold" /> رقم الطلب
            </label>
            <input
              required
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="MIL-XXXX"
              className="w-full bg-dark-base border border-dark-border rounded-xl px-4 py-4 text-text-primary focus:border-gold outline-none transition-all font-display"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold" /> رقم التليفون
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full bg-dark-base border border-dark-border rounded-xl px-4 py-4 text-text-primary focus:border-gold outline-none transition-all font-display"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 py-4 bg-gold text-dark-base font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gold-light transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
          >
            <Search className="w-6 h-6" />
            {isLoading ? 'جاري البحث...' : 'بحث عن الطلب'}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </section>

      {/* Result Section */}
      {order && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
          <div className="divider-gold" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-1 bg-dark-surface border border-dark-border rounded-3xl p-8">
              <h3 className="text-xl font-bold text-text-primary mb-8">حالة الطلب</h3>
              <OrderTimeline currentStatus={order.status} />
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-dark-surface border border-dark-border rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-gold" />
                  تفاصيل المنتجات
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-dark-border/50 last:border-0">
                      <div className="space-y-1">
                        <p className="font-bold text-text-primary">{item.product_name_ar}</p>
                        <p className="text-xs text-gold">{item.variant_name_ar} x {item.quantity}</p>
                      </div>
                      <span className="font-bold text-text-primary">{formatPrice(item.line_total)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>رسوم التوصيل</span>
                    <span>{formatPrice(order.delivery_fee)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-dark-border mt-4">
                    <span className="text-text-primary">الإجمالي</span>
                    <span className="text-gold">{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
