'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  MapPin,
  X,
  User,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { FaSquareFacebook } from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type Transition,
} from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية', en: 'Home' },
  { href: '/products', label: 'المنتجات', en: 'Products' },
  { href: '/specialCake', label: 'الكيك الخاص', en: 'Special Cakes' },
  { href: '/about', label: 'من نحن', en: 'About' },
  { href: '/branches', label: 'الفروع', en: 'Branches' },
  { href: '/contact-us', label: 'اتصل بنا', en: 'Contact' },
];

const MENU_LINK = 'https://l.facebook.com/l.php?u=https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1hC_i31wM25tKTxFXSXIdoT4w3iZpBnfE%2Fview%3Fusp%3Dsharing';

const ease: Transition['ease'] = [0.16, 1, 0.3, 1];

// ─── Magnetic Cart ────────────────────────────────────────
function MagneticCart({ count, onClick, isScrolled }: { count: number; onClick: () => void; isScrolled: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 22 });
  const sy = useSpring(y, { stiffness: 350, damping: 22 });

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e : React.MouseEvent<HTMLButtonElement>)  => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500',
        isScrolled
          ? 'border-black/15 text-black hover:border-black/40 hover:bg-black/5'
          : 'border-white/20 text-white hover:border-white/40 hover:bg-white/5'
      )}
    >
      <ShoppingBag strokeWidth={1.5} className="w-5 h-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-text-on-gold text-[9px] font-black flex items-center justify-center rounded-full"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const { city, area, setIsModalOpen } = useLocation();
  const pathname = usePathname();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const cartCount = mounted ? totalItems : 0;

  return (
    <>
      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
          isScrolled
            ? 'py-3 bg-white/96 backdrop-blur-xl shadow-sm border-b border-black/5'
            : 'py-6 bg-gradient-to-b from-black/55 via-black/20 to-transparent'
        )}
      >
        <div className="container mx-auto flex items-center justify-between">

          {/* Burger */}
          <div className="flex-1">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-3"
              aria-label="فتح القائمة"
            >
              <div className="flex flex-col gap-[5px] w-7">
                <motion.span
                  animate={{ width: '100%' }}
                  whileHover={{ width: '75%' }}
                  className={cn('block h-[1.5px] transition-colors duration-500', isScrolled ? 'bg-black' : 'bg-white')}
                />
                <motion.span
                  animate={{ width: '75%' }}
                  whileHover={{ width: '100%' }}
                  className={cn('block h-[1.5px] transition-colors duration-500', isScrolled ? 'bg-black' : 'bg-white')}
                />
                <motion.span
                  animate={{ width: '50%' }}
                  whileHover={{ width: '75%' }}
                  className={cn('block h-[1.5px] transition-colors duration-500', isScrolled ? 'bg-black' : 'bg-white')}
                />
              </div>
              <span className={cn('hidden sm:block text-[9px] font-black uppercase tracking-[0.28em] transition-colors duration-500', isScrolled ? 'text-black/60' : 'text-white/70')}>
                القائمة
              </span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-none flex justify-center">
            <Link
              href="/"
            >
              <h1 className="text-gold text-[20px] font-noto-urdu">MILANO</h1>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 ">
            <Link
              href="/account/profile"
              className={cn(
                'hidden sm:flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500',
                isScrolled
                  ? 'border-black/15 text-black hover:border-black/40 hover:bg-black/5'
                  : 'border-white/20 text-white hover:border-white/40 hover:bg-white/5'
              )}
            >
              <User strokeWidth={1.5} className="w-5 h-5" />
            </Link>
            <MagneticCart count={cartCount} onClick={() => setIsCartOpen(true)} isScrolled={isScrolled} />
          </div>
        </div>
      </motion.header>

      {/* ── FULL SCREEN MENU ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 60px) 40px)' }}
            animate={{ clipPath: 'circle(200% at calc(100% - 60px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 60px) 40px)', transition: { duration: 0.6, ease } }}
            transition={{ duration: 0.9, ease }}
            className="fixed inset-0 z-[60] bg-[#0e0e0e] overflow-y-auto"
          >
            {/* Close */}
            <div className="absolute top-6 right-6 md:top-8 md:right-12 z-10">
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:border-gold hover:text-text-on-gold hover:rotate-90 transition-all duration-500"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* MILANO watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="font-display text-[20vw] font-bold text-white/[0.02] tracking-widest">MILANO</span>
            </div>

            <div className="container mx-auto px-6 min-h-screen flex flex-col md:flex-row items-center py-24 md:py-0 gap-12">

              {/* Nav Links */}
              <nav className="w-full md:w-1/2 relative z-10">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease }}
                    className="overflow-hidden"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'group flex items-center justify-between py-4 border-b border-white/[0.06] hover:border-gold/20 transition-all duration-500',
                        pathname === link.href ? 'opacity-100' : 'opacity-25 hover:opacity-100'
                      )}
                    >
                      <div className="flex items-center gap-5">
                        {pathname === link.href && (
                          <motion.span layoutId="activeDot" className="w-2 h-2 bg-gold rounded-full shrink-0" />
                        )}
                        <span
                          className={cn(
                            'font-display font-light text-white group-hover:text-gold transition-colors duration-500 leading-none',
                            pathname === link.href ? 'text-gold' : ''
                          )}
                          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
                        >
                          {link.label}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 group-hover:text-gold/40 transition-colors duration-500 hidden sm:block">
                        {link.en}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7, ease }}
                className="w-full md:w-1/2 md:pr-12 border-t md:border-t-0 md:border-r border-white/[0.06] pt-12 md:pt-0 relative z-10"
              >
                {/* Location */}
                <div className="mb-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 block mb-3">منطقة التوصيل</span>
                  <button
                    onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }}
                    className="flex items-center gap-3 text-lg font-medium text-white/70 hover:text-gold transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    {mounted && city ? `${city} · ${area}` : 'حدد منطقتك'}
                  </button>
                </div>

                {/* Contact */}
                <div className="mb-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 block mb-4">تواصل معنا</span>
                  <a href="tel:01013689991" className="flex items-center gap-3 font-display text-2xl text-white/70 hover:text-gold transition-colors mb-5">
                    <Phone className="w-4 h-4 text-white/20 shrink-0" />
                    01013689991
                  </a>
                  <div className="flex gap-3">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300">
                      <FaInstagram className="w-4 h-4" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300">
                      <FaSquareFacebook className="w-4 h-4" />
                    </a>
                    <a href={MENU_LINK} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 h-10 rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300">
                      المنيو <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 block mb-3">مواعيد العمل</span>
                  <p className="text-white/40 text-sm leading-relaxed">
                    يومياً · 10 صباحاً — 12 مساءً
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
