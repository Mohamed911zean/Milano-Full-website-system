'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, total, removeItem, updateQuantity, isCartOpen, setIsCartOpen } = useCart();
  const [mounted, setMounted] = React.useState(false);

  // Drag-to-close support (mobile swipe)
  const dragControls = useDragControls();
  const drawerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    if (!isCartOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when cart is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleQuantityChange = (id: number, delta: number, currentQty: number) => {
    if (currentQty + delta < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, delta);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-[6px] z-[100]"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            drag="x"
            dragControls={dragControls}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.3 }}
            onDragEnd={(_ : any, info : any) => {
              if (info.offset.x > 120 || info.velocity.x > 500) setIsCartOpen(false);
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 bottom-0 right-0 w-full max-w-[420px] bg-bg-base z-[101] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            aria-label="سلة التسوق"
            role="dialog"
            aria-modal="true"
          >
            {/* ── Drag handle (mobile) ── */}
            <div
              className="absolute top-2 left-0 right-0 flex justify-center w-full sm:hidden"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-white/15 cursor-grab active:cursor-grabbing" />
            </div>

            {/* ── Header ── */}
            <div className="px-5 py-5 border-b border-border-subtle flex items-center justify-between bg-bg-card shrink-0 mt-3 sm:mt-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="text-base font-display text-text-primary uppercase tracking-widest">
                  سلة التسوق
                </h2>
                <AnimatePresence>
                  {items.length > 0 && (
                    <motion.span
                      key={items.length}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="bg-gold text-text-on-gold text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center"
                    >
                      {items.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="إغلاق السلة"
                className="w-9 h-9 rounded-full border border-border-subtle flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/40 transition-all duration-300 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Items List ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center px-6 py-16 min-h-[320px]"
                  >
                    {/* Animated empty bag */}
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 bg-bg-elevated rounded-full flex items-center justify-center text-text-muted mb-6 border border-gold-border/10"
                    >
                      <ShoppingBag className="w-9 h-9" />
                    </motion.div>
                    <h3 className="text-lg font-display text-text-primary mb-2">
                      سلتك فارغة
                    </h3>
                    <p className="text-text-secondary text-sm mb-8 leading-relaxed max-w-[220px]">
                      ابدأ بإضافة بعض المنتجات الشهية لتظهر هنا.
                    </p>
                    <Link
                      href="/products"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold text-[11px] font-black uppercase tracking-[0.18em] shadow-[0_4px_20px_rgba(212,169,79,0.3)] hover:shadow-[0_6px_28px_rgba(212,169,79,0.45)] transition-all duration-300 active:scale-95"
                    >
                      ابدأ التسوق
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <div className="p-4 sm:p-5 space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
                        className="bg-bg-card rounded-2xl border border-gold-border/8 overflow-hidden"
                      >
                        <div className="flex gap-3 p-3">
                          {/* Image */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gold-border/10 shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-wide leading-snug line-clamp-2 flex-1">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label={`حذف ${item.name}`}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-text-fade hover:text-error hover:bg-red-500/10 transition-all duration-200 active:scale-90 shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity stepper */}
                              <div className="flex items-center bg-bg-elevated border border-gold-border/10 rounded-full px-1 py-0.5 gap-0.5">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                                  aria-label="تقليل الكمية"
                                  className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-full hover:bg-gold/8 active:scale-90"
                                >
                                  {item.quantity === 1
                                    ? <Trash2 className="w-3 h-3" />
                                    : <Minus className="w-3 h-3" />}
                                </button>
                                <span className="w-7 text-center text-[12px] font-bold text-text-primary select-none tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                                  aria-label="زيادة الكمية"
                                  className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-full hover:bg-gold/8 active:scale-90"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Line total */}
                              <div className="text-left">
                                <p className="text-gold font-bold text-[13px] tabular-nums">
                                  {(item.price * item.quantity).toLocaleString()} EGP
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-text-fade text-[10px]">
                                    {item.price} × {item.quantity}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="shrink-0 bg-bg-card border-t border-border-subtle"
                >
                  {/* Order summary */}
                  <div className="px-5 pt-4 pb-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-[11px] uppercase tracking-widest font-bold">
                        المجموع الفرعي
                      </span>
                      <motion.span
                        key={total}
                        initial={{ scale: 1.1, color: '#d4a94f' }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-display text-gold font-semibold tabular-nums"
                      >
                        {total.toLocaleString()} EGP
                      </motion.span>
                    </div>
                    <p className="text-[10px] text-text-fade text-center uppercase tracking-wider">
                      يتم احتساب الشحن عند إتمام الطلب
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="px-5 pb-5 pt-2 space-y-2.5">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className={cn(
                        'w-full h-14 rounded-2xl',
                        'text-[11px] font-black uppercase tracking-[0.22em]',
                        'bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold',
                        'shadow-[0_6px_28px_rgba(212,169,79,0.35)] hover:shadow-[0_10px_36px_rgba(212,169,79,0.5)]',
                        'flex items-center justify-center gap-2.5',
                        'transition-all duration-400 hover:-translate-y-0.5 active:scale-[0.98]',
                        'relative overflow-hidden group',
                      )}
                    >
                      {/* Shine sweep */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-800" />
                      </div>
                      <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      إتمام الطلب
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full h-11 rounded-xl text-[10px] uppercase tracking-[0.18em] font-bold text-text-muted hover:text-gold border border-gold-border/10 hover:border-gold-border/30 transition-all duration-300 active:scale-95"
                    >
                      متابعة التسوق
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
