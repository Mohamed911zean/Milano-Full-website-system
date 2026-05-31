import Link from 'next/link'
import { ShopConfigValues } from '@/lib/supabase/types'

interface FooterProps {
  config: ShopConfigValues
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-auto pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-display text-4xl font-bold text-gold inline-block">
              Milano
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto md:mr-0">
              حلويات راقية من قلب المنصورة، نجمع بين الأصالة والجودة لنقدم لكم تجربة فريدة لا تُنسى.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-gold font-bold text-lg">تواصل معنا</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              <li>{config.address}</li>
              <li>الهاتف: {config.shop_phone}</li>
              <li>واتساب: {config.whatsapp_number}</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-gold font-bold text-lg">روابط سريعة</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold transition-colors">المنيو</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors">تتبع طلبك</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-border text-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-6" />
          <p className="text-text-disabled text-xs">
            جميع الحقوق محفوظة © {new Date().getFullYear()} Milano Sweets
          </p>
        </div>
      </div>
    </footer>
  )
}
