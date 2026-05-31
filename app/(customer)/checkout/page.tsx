import { getShopConfig } from '@/lib/services/config'
import CheckoutForm from '@/components/customer/CheckoutForm'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function CheckoutPage() {
  const config = await getShopConfig()
  const deliveryFee = typeof config.delivery_fee === 'number' ? config.delivery_fee : 0

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link 
              href="/products"
              className="text-text-muted hover:text-gold transition-colors flex items-center gap-2 text-sm"
            >
              <ArrowRight className="w-4 h-4" /> العودة للتسوق
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary">إتمام الطلب</h1>
          </div>
          <p className="text-text-muted text-lg">مراجعة السلة وتأكيد البيانات</p>
        </div>

        {/* Form */}
        <CheckoutForm deliveryFee={deliveryFee} />
      </div>
    </div>
  )
}
