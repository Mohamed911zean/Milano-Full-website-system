"use client"

import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { submitOrder } from '@/app/actions/orders'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Truck, Store, MapPin, User, Phone, MessageSquare, CheckCircle2 } from 'lucide-react'

interface CheckoutFormProps {
  deliveryFee: number
}

export default function CheckoutForm({ deliveryFee }: CheckoutFormProps) {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const subtotal = totalPrice()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    fulfillmentType: 'delivery' as 'delivery' | 'pickup',
    deliveryAddress: '',
    customerNotes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const result = await submitOrder({
      ...formData,
      items: items.map(item => ({
        ...item,
        variantId: item.variantId || '00000000-0000-0000-0000-000000000000', // Handle empty UUID if needed
      })),
    } as any)

    if (result.success) {
      clearCart()
      router.push(`/order-confirmed?number=${result.orderNumber}`)
    } else {
      setIsLoading(false)
      if (result.errors) {
        setFieldErrors(result.errors as any)
      } else {
        setError(result.message || 'حدث خطأ ما')
      }
    }
  }

  const finalTotal = subtotal + (formData.fulfillmentType === 'delivery' ? deliveryFee : 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 rounded-full bg-dark-surface flex items-center justify-center text-text-disabled mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">سلتك فاضية</h2>
        <p className="text-text-muted">لا يمكنك إتمام الطلب وسلتك فارغة</p>
        <button 
          onClick={() => router.push('/products')}
          className="px-8 py-3 bg-gold text-dark-base font-bold rounded-xl hover:bg-gold-light transition-colors"
        >
          تصفح المنتجات
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Form Section */}
      <div className="lg:col-span-2 space-y-10">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <User className="w-6 h-6 text-gold" />
            البيانات الشخصية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">الاسم الكريم *</label>
              <input
                required
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-text-primary focus:border-gold outline-none transition-colors"
                placeholder="اسمك بالكامل"
              />
              {fieldErrors.customerName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.customerName[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">رقم التليفون *</label>
              <input
                required
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-text-primary focus:border-gold outline-none transition-colors"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
              {fieldErrors.customerPhone && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.customerPhone[0]}</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Truck className="w-6 h-6 text-gold" />
            طريقة الاستلام
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, fulfillmentType: 'delivery' })}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300",
                formData.fulfillmentType === 'delivery'
                  ? "bg-gold/10 border-gold text-gold"
                  : "bg-dark-surface border-dark-border text-text-muted hover:border-gold/40"
              )}
            >
              <Truck className="w-8 h-8" />
              <span className="font-bold">توصيل للباب</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, fulfillmentType: 'pickup' })}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300",
                formData.fulfillmentType === 'pickup'
                  ? "bg-gold/10 border-gold text-gold"
                  : "bg-dark-surface border-dark-border text-text-muted hover:border-gold/40"
              )}
            >
              <Store className="w-8 h-8" />
              <span className="font-bold">استلام من الفرع</span>
            </button>
          </div>

          {formData.fulfillmentType === 'delivery' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">العنوان بالتفصيل *</label>
                <textarea
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-text-primary focus:border-gold outline-none transition-colors min-h-[100px]"
                  placeholder="رقم الشارع، رقم العمارة، الدور، الشقة..."
                />
                {fieldErrors.deliveryAddress && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.deliveryAddress[0]}</p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-gold" />
            ملاحظات إضافية
          </h2>
          <textarea
            value={formData.customerNotes}
            onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-text-primary focus:border-gold outline-none transition-colors min-h-[100px]"
            placeholder="أي ملاحظات تانية حابب تضيفها؟"
          />
        </section>
      </div>

      {/* Summary Section */}
      <div className="space-y-6">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 sticky top-32">
          <h3 className="text-xl font-bold text-text-primary mb-6">ملخص الطلب</h3>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                <span className="text-text-muted">
                  {item.productNameAr} <span className="text-gold">x{item.quantity}</span>
                </span>
                <span className="text-text-primary font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="divider-gold mb-6" />

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">المجموع الفرعي</span>
              <span className="text-text-primary">{formatPrice(subtotal)}</span>
            </div>
            {formData.fulfillmentType === 'delivery' && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">رسوم التوصيل</span>
                <span className="text-text-primary">{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-4">
              <span className="text-text-primary">الإجمالي</span>
              <span className="text-gold">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm mb-6">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300",
              isLoading
                ? "bg-gold/50 text-dark-base cursor-not-allowed"
                : "bg-gold text-dark-base hover:bg-gold-light shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-95"
            )}
          >
            {isLoading ? (
              'يتم التأكيد...'
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                تأكيد الطلب
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
