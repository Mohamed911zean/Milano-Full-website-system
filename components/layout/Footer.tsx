"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { motion, useInView, type Transition } from "framer-motion";


const NAVIGATION = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/specialCake", label: "الكيك الخاص" },
  { href: "/about", label: "من نحن" },
  { href: "/branches", label: "الفروع" },
];

const ease: Transition["ease"] = [0.22, 1, 0.36, 1];

export function Footer() {
  const pathname = usePathname();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Hide footer on product detail pages: /products/<any-segment>
  if (/^\/products\/[^/]+/.test(pathname)) return null;

  return (
    <footer ref={ref} className="relative overflow-hidden bg-bg-base border-t border-white/5 pt-32 pb-12">
      {/* Top gold line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-border to-transparent" />

      {/* Ambient */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/5 blur-[160px] pointer-events-none" />

      {/* Giant MILANO watermark */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden pb-8 opacity-[0.015]">
        <span className="font-display text-[20vw] font-bold tracking-widest text-white leading-none">MILANO</span>
      </div>

      <div className="container relative z-10">

        {/* ── Top: brand statement ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease }}
          className="mb-20 text-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/50 block mb-4">Premium Patisserie · Since 2010</span>
          <h2
            className="font-display font-light text-white tracking-[-0.05em] leading-none mb-6"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
          >
            MILANO
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto font-light">
            نقدم تجربة حلويات فاخرة تمزج بين الحرفية الإيطالية والذوق العصري، مع تفاصيل مصنوعة بعناية تمنح كل زيارة طابعاً استثنائياً.
          </p>
        </motion.div>

        {/* ── Divider ── */}
        <div className="divider-gold mb-20" />

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-10 mb-20 text-right">

          {/* Brand / Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-fade mb-8">تابعنا</h4>
            <div className="flex items-center gap-3 justify-end">
              <a href="#"
                className="group w-11 h-11 rounded-full border border-white/8 flex items-center justify-center text-text-fade hover:text-gold hover:border-gold/30 hover:-translate-y-1 transition-all duration-500">
                <FaInstagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#"
                className="group w-11 h-11 rounded-full border border-white/8 flex items-center justify-center text-text-fade hover:text-gold hover:border-gold/30 hover:-translate-y-1 transition-all duration-500">
                <FaFacebookF className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-fade mb-8">روابط سريعة</h4>
            <ul className="flex flex-col gap-4">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-end gap-2 text-sm text-text-muted hover:text-gold transition-all duration-300"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="sm:col-span-2"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-fade mb-8">تواصل معنا</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Phone, label: 'الخط الساخن', value: '01013689991', href: 'tel:01013689991' },
                { icon: Clock3, label: 'مواعيد العمل', value: 'يومياً 10ص — 12م', href: null },
                { icon: MapPin, label: 'فروعنا', value: 'المنصورة · طلخا · بلقاس', href: '/branches' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3 justify-end text-right group">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-fade mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-text-secondary hover:text-gold transition-colors duration-300 font-medium" dir="ltr">{value}</a>
                    ) : (
                      <p className="text-sm text-text-secondary font-medium">{value}</p>
                    )}
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/8 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold group-hover:text-text-on-gold transition-all duration-500">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom ── */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row-reverse items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-fade">
            © 2026 Milano Sweets · All Rights Reserved
          </p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="text-[10px] uppercase tracking-[0.2em] text-text-fade hover:text-gold transition-colors duration-300 font-bold">
              الخصوصية
            </Link>
            <Link href="/terms" className="text-[10px] uppercase tracking-[0.2em] text-text-fade hover:text-gold transition-colors duration-300 font-bold">
              الشروط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}