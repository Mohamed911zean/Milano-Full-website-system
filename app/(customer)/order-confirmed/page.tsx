import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Search, MessageCircle } from 'lucide-react'
import { getShopConfig } from '@/lib/services/config'

interface OrderConfirmedPageProps {
  searchParams: { number?: string }
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const orderNumber = searchParams.number
  const config = await getShopConfig()

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold animate-bounce-slow">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">تم استلام طلبك بنجاح!</h1>
          <p className="text-text-muted text-lg">
            شكراً لثقتك في حلويات ميلانو. فريقنا هيراجع الطلب وهيتواصل معاك لتأكيد ميعاد الاستلام.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-dark-surface border border-dark-border rounded-3xl p-8 space-y-2">
          <p className="text-text-disabled text-sm uppercase tracking-widest">رقم الطلب</p>
          <p className="text-5xl font-display font-bold text-gold">{orderNumber || 'MIL-XXXX'}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/track-order"
            className="flex items-center justify-center gap-3 p-4 bg-dark-surface border border-dark-border text-text-primary font-bold rounded-xl hover:border-gold transition-all"
          >
            <Search className="w-5 h-5 text-gold" />
            تتبع الطلب
          </Link>
          <a
            href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 bg-[#25D366] text-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            تواصل معنا
          </a>
          <Link
            href="/"
            className="sm:col-span-2 flex items-center justify-center gap-3 p-4 bg-gold text-dark-base font-bold rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
          >
            <ShoppingBag className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
