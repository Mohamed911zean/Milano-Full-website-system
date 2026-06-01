'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin} from 'lucide-react';
import { FaInstagram , FaFacebook} from 'react-icons/fa'
import { ShopConfigValues } from '@/lib/supabase/types';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/shop', label: 'المتجر' },
  { href: '/about', label: 'من نحن' },
  { href: '/branches', label: 'فروعنا' },
];

const SUPPORT_LINKS = [
  { href: '/contact-us', label: 'اتصل بنا' },
  { href: '/privacy-policy', label: 'سياسة الخصوصية' },
  { href: '/terms', label: 'الشروط والأحكام' },
];

interface FooterProps {
  config: ShopConfigValues;
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="bg-bg-deep border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Gradient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20 text-right">

          {/* Column 1: Brand */}
          <div className="flex flex-col items-start md:items-end">
            <div className="mb-8">
              <span className="font-display text-4xl font-bold text-gold tracking-widest">MILANO</span>
              <span className="block text-[10px] tracking-[0.4em] font-light uppercase text-white/60 text-center">Sweets</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-xs font-light">
              نصنع لكم أجمل الذكريات مع كل قطعة حلوى، بجودة عالمية ولمسة مصرية أصيلة من قلب المنصورة.
            </p>
            <div className="flex gap-5">
              <a
                href="#"
                className="w-11 h-11 rounded-full border border-gold-border/40 flex items-center justify-center text-gold hover:bg-gold hover:text-text-on-gold hover:shadow-gold transition-all duration-500 ease-premium group"
              >
                <FaFacebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full border border-gold-border/40 flex items-center justify-center text-gold hover:bg-gold hover:text-text-on-gold hover:shadow-gold transition-all duration-500 ease-premium group"
              >
                <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
                className="w-11 h-11 rounded-full border border-gold-border/40 flex items-center justify-center text-gold hover:bg-gold hover:text-text-on-gold hover:shadow-gold transition-all duration-500 ease-premium group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-text-primary font-bold mb-8 uppercase tracking-[0.2em] text-[11px]">
              روابط سريعة
            </h4>
            <ul className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-gold transition-colors duration-300 text-sm font-medium tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-text-primary font-bold mb-8 uppercase tracking-[0.2em] text-[11px]">
              الدعم والمساعدة
            </h4>
            <ul className="flex flex-col gap-5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-gold transition-colors duration-300 text-sm font-medium tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-text-primary font-bold mb-8 uppercase tracking-[0.2em] text-[11px]">
              تواصل معنا
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start justify-end gap-4 text-text-secondary text-sm group">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-fade font-bold">
                    اتصل بنا
                  </span>
                  <a href={`tel:${config.shop_phone}`} className="hover:text-gold transition-colors font-medium" dir="ltr">
                    {config.shop_phone}
                  </a>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold-subtle/30 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold group-hover:text-text-on-gold transition-all duration-500">
                  <Phone className="w-4 h-4" />
                </div>
              </li>
              <li className="flex items-start justify-end gap-4 text-text-secondary text-sm group">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-fade font-bold">
                    موقعنا
                  </span>
                  <span className="font-medium">
                    {config.address}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold-subtle/30 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold group-hover:text-text-on-gold transition-all duration-500">
                  <MapPin className="w-4 h-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row-reverse items-center justify-between gap-8 text-center md:text-right">
          <p className="text-text-fade text-[11px] font-medium tracking-wider uppercase flex items-center gap-2 flex-wrap justify-center">
            © 2026 Milano Sweets · جميع الحقوق محفوظة
            <span className="text-white/20">|</span>
            <a
              href="#"
              className="text-gold hover:text-white transition-all duration-300 font-bold tracking-[0.2em]"
            >
              MADE BY MILANO TEAM
            </a>
          </p>

          <div className="flex gap-8">
            <Link
              href="/privacy-policy"
              className="text-text-fade hover:text-gold transition-colors text-[11px] font-bold uppercase tracking-widest"
            >
              الخصوصية
            </Link>
            <Link
              href="/terms"
              className="text-text-fade hover:text-gold transition-colors text-[11px] font-bold uppercase tracking-widest"
            >
              الشروط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
