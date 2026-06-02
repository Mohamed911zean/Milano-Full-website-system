import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Search, MessageCircle, ArrowLeft } from 'lucide-react'
import { getShopConfig } from '@/lib/services/config'
import { SectionLabel, GoldDivider } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'

interface OrderConfirmedPageProps {
  searchParams: { number?: string }
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const orderNumber = searchParams.number
  const config = await getShopConfig()

  return (
    <div className="min-h-screen bg-bg-base pt-32 pb-24 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Success Icon Animation */}
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gold/10 flex items-center justify-center text-gold animate-in zoom-in-50 duration-700">
              <CheckCircle2 className="w-20 h-20" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping opacity-20" />
          </div>

          {/* Message */}
          <div className="space-y-6">
            <SectionLabel className="justify-center">تهانينا!</SectionLabel>
            <h1 className="text-h1 font-display font-light text-white leading-tight">
              تم استلام طلبك <span className="text-gold italic">بنجاح</span>
            </h1>
            <p className="text-text-secondary text-xl font-light max-w-2xl mx-auto leading-relaxed">
              شكراً لثقتك في حلويات ميلانو. فريقنا سيبدأ العمل على طلبك فوراً وسنتواصل معك قريباً لتأكيد الموعد.
            </p>
          </div>

          {/* Order Card */}
          <div className="glass-card rounded-[40px] p-12 md:p-16 space-y-8 relative overflow-hidden">
            {/* Luxury Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-gold opacity-50" />
            
            <div className="space-y-2">
              <span className="text-[10px] text-text-fade font-black uppercase tracking-[0.4em]">رقم الطلب الفاخر</span>
              <p className="text-6xl md:text-7xl font-display font-bold text-gold tracking-tighter">
                {orderNumber || 'MIL-XXXX'}
              </p>
            </div>
            
            <GoldDivider centered />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/track-order" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-16 px-10">
                  <Search className="w-5 h-5 ml-3" /> تتبع الطلب
                </Button>
              </Link>
              <a 
                href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full h-16 px-10 bg-[#25D366] hover:bg-[#1ebd5e] border-none">
                  <MessageCircle className="w-5 h-5 ml-3" /> استفسار واتساب
                </Button>
              </a>
            </div>
          </div>

          {/* Return Action */}
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-fade hover:text-gold transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
