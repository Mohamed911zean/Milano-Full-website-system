'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, X, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنيو' },
  { href: '/track-order', label: 'تتبع طلبك' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const cartCount = totalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const textColor = isScrolled ? "text-text-primary" : "text-white drop-shadow-md";
  const iconColor = isScrolled
    ? "text-gold hover:text-gold-light"
    : "text-white hover:text-gold drop-shadow-md";
  const burgerLineColor = isScrolled ? "bg-gold" : "bg-white shadow-sm";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-premium",
          isScrolled
            ? "py-4 bg-bg-base/95 backdrop-blur-md shadow-sm border-b border-white/5"
            : "py-6 bg-gradient-to-b from-black/60 via-black/20 to-transparent"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* LEFT: Menu trigger */}
          <div className="flex-1">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-3 hover:opacity-70 transition-opacity"
            >
              <div className="flex flex-col gap-[5px] items-start justify-center w-8 h-8">
                <span className={cn("block h-[2px] w-full transition-all group-hover:w-3/4", burgerLineColor)} />
                <span className={cn("block h-[2px] w-3/4 transition-all group-hover:w-full", burgerLineColor)} />
                <span className={cn("block h-[2px] w-1/2 transition-all group-hover:w-3/4", burgerLineColor)} />
              </div>
              <span className={cn("hidden sm:block text-[10px] font-black uppercase tracking-[0.2em]", textColor)}>
                القائمة
              </span>
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="flex-none flex justify-center">
            <Link href="/" className="group flex flex-col items-center">
              <span className={cn(
                "font-display text-2xl md:text-3xl font-bold tracking-widest transition-all duration-700",
                isScrolled ? "text-gold" : "text-white drop-shadow-xl"
              )}>
                MILANO
              </span>
              <span className={cn(
                "text-[8px] tracking-[0.4em] font-light uppercase transition-all duration-700",
                isScrolled ? "text-gold/60" : "text-white/60"
              )}>
                Sweets
              </span>
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
            <Link href="/account" className={cn("hidden sm:block transition-colors", iconColor)}>
              <User strokeWidth={1.5} className="w-5 h-5" />
            </Link>
            <button
              className={cn("relative flex items-center gap-2 transition-colors", iconColor)}
            >
              <ShoppingBag strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gold text-text-on-gold text-[10px] font-bold flex items-center justify-center rounded-full border border-white/20">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 0% 0%)" }}
            animate={{ clipPath: "circle(150% at 0% 0%)" }}
            exit={{ clipPath: "circle(0% at 0% 0%)", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-bg-base min-h-screen overflow-y-auto"
          >
            <div className="absolute top-6 right-6 md:top-8 md:right-12 z-10">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gold text-text-on-gold hover:bg-gold-light hover:rotate-90 transition-all duration-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="container mx-auto px-6 py-24 md:py-0 min-h-screen flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-8 justify-center">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "group inline-flex items-center gap-6 transition-opacity duration-300",
                        pathname === link.href
                          ? "opacity-100"
                          : "opacity-25 hover:opacity-100"
                      )}
                    >
                      <span className="text-4xl sm:text-6xl lg:text-7xl font-display font-light tracking-tight text-white">
                        {link.label}
                      </span>
                      {pathname === link.href && (
                        <motion.span
                          layoutId="activeDot"
                          className="w-3 h-3 md:w-4 md:h-4 bg-gold rounded-full hidden md:block"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="w-full md:w-1/2 flex flex-col mt-16 md:mt-0 pl-0 md:pl-24 border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 text-right">
                <div className="mb-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4">
                    ميلانو للحلويات
                  </h4>
                  <p className="text-xl font-light text-text-secondary leading-relaxed max-w-sm ml-auto">
                    حلويات راقية صُنعت بكل حب وشغف لتناسب جميع مناسباتكم السعيدة.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Link href="/account" className="flex items-center justify-end gap-3 text-lg font-medium text-text-primary hover:text-gold transition-colors">
                    <span>حسابي</span>
                    <User className="w-5 h-5 text-gold" />
                  </Link>
                  <Link href="/track-order" className="flex items-center justify-end gap-3 text-lg font-medium text-text-primary hover:text-gold transition-colors">
                    <span>تتبع الطلبات</span>
                    <ShoppingBag className="w-5 h-5 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
