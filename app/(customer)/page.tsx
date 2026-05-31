import Image from 'next/image'
import Link from 'next/link'
import ProductGrid from '@/components/customer/ProductGrid'
import { getActiveCategories, getFeaturedProducts } from '@/lib/services/products'
import { getShopConfig } from '@/lib/services/config'
import { ArrowRight, Clock, MapPin, CheckCircle2 } from 'lucide-react'

export default async function HomePage() {
  const [categories, featuredProducts, config] = await Promise.all([
    getActiveCategories(),
    getFeaturedProducts(),
    getShopConfig(),
  ])

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background with subtle overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-base/60 via-dark-base/80 to-dark-base z-10" />
          {/* Placeholder or actual hero image could go here */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2000')] bg-cover bg-center opacity-40" />
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center space-y-8">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-gold animate-fade-in">
            Milano
          </h1>
          <p className="text-xl md:text-2xl text-text-primary font-medium max-w-2xl mx-auto leading-relaxed">
            حلويات راقية من قلب المنصورة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-10 py-4 bg-gold text-dark-base font-bold rounded-md hover:bg-gold-light transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-gold/20"
            >
              اطلب الآن
            </Link>
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-10 py-4 border border-gold text-gold font-bold rounded-md hover:bg-gold/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              شاهد المنيو
            </Link>
          </div>
        </div>

        {/* Scroll Indicator / Ornament */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">الأقسام</h2>
          <Link href="/products" className="text-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            كل الأقسام <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.id}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-dark-border hover:border-gold/40 transition-all duration-500"
            >
              {category.image_url && (
                <Image 
                  src={category.image_url} 
                  alt={category.name_ar} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <h3 className="text-lg font-bold text-text-primary group-hover:text-gold transition-colors">
                  {category.name_ar}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ornament Divider */}
      <div className="divider-gold container mx-auto" />

      {/* 3. Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">الأكثر طلباً</h2>
          <Link href="/products" className="text-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            شاهد الكل <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 4. How to Order */}
      <section className="bg-dark-surface py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-16">كيفية الطلب</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Clock className="w-8 h-8" />, title: "اختار منتجاتك", desc: "تصفح المنيو واختار اللي تحبه من حلوياتنا الفاخرة" },
              { icon: <CheckCircle2 className="w-8 h-8" />, title: "أكمل بياناتك", desc: "دخل اسمك ورقم تليفونك وعنوانك بكل سهولة" },
              { icon: <MapPin className="w-8 h-8" />, title: "انتظر التوصيل", desc: "فريقنا هيتواصل معاك ويوصلك الأوردر لحد باب البيت" },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-dark-base border border-gold/20 flex items-center justify-center text-gold shadow-lg shadow-gold/5">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WhatsApp CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent rounded-3xl border border-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-right">
            <h2 className="text-2xl md:text-4xl font-bold text-text-primary">عندك استفسار أو طلب خاص؟</h2>
            <p className="text-text-muted">تواصل معنا مباشرة على واتساب، فريقنا جاهز للرد على كل طلباتكم</p>
          </div>
          <a 
            href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-[#25D366] text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-3 shadow-xl shadow-green-500/20"
          >
            تواصل معنا عبر واتساب
          </a>
        </div>
      </section>
    </div>
  )
}
