'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, type Transition } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Check, Clock, Truck, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { Category, ProductWithVariants } from '@/lib/supabase/types';

const ease: Transition['ease'] = [0.22, 1, 0.36, 1];

interface Props {
  product: ProductWithVariants & { category: Category | null };
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const imgRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const variants = product.variants ?? [];
  const defaultVariant = variants.find(v => v.is_default) ?? variants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = Number(selectedVariant?.price ?? product.base_price);
  const total = price * quantity;
  const image = product.images?.[0];

  const handleAdd = () => {
    if (added) return;
    addItem(
      {
        id: product.id,
        name: selectedVariant ? `${product.name_ar} — ${selectedVariant.name_ar}` : product.name_ar,
        price,
        image: image ?? '',
      },
      true,
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-bg-base min-h-screen overflow-x-hidden" dir="rtl">

      {/* ──────────────────────── AMBIENT GLOW ──────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px]" />
      </div>

      {/* ──────────────────────── BACK BUTTON ──────────────────────── */}
      <div className="relative z-20 container pt-24 pb-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-text-muted hover:text-gold transition-colors duration-300"
        >
          <span className="w-8 h-8 rounded-full border border-gold-border/20 flex items-center justify-center group-hover:border-gold/40 group-hover:bg-gold/5 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold">رجوع</span>
        </button>
      </div>

      {/* ──────────────────────── HERO LAYOUT ──────────────────────── */}
      <section className="relative z-10 container">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 xl:gap-24">

          {/* ── IMAGE ── */}
          <div
            ref={imgRef}
            className="w-full lg:w-[52%] lg:sticky lg:top-24 lg:self-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease }}
              className="relative overflow-hidden rounded-3xl bg-bg-card"
              style={{ height: 'clamp(380px, 56vw, 680px)' }}
            >
              <motion.div className="absolute inset-0" style={{ scale: imgScale, y: imgY }}>
                {image ? (
                  <Image
                    src={image}
                    alt={product.name_ar}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    quality={95}
                  />
                ) : (
                  <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                    <span className="font-display text-gold/15 text-9xl font-bold select-none">M</span>
                  </div>
                )}
              </motion.div>

              {/* gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-base/10 lg:to-bg-base/20" />

              {/* badges */}
              <div className="absolute top-5 right-5 flex flex-col gap-2">
                {product.is_featured && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, ease }}
                    className="flex items-center gap-1.5 bg-gold text-text-on-gold text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-lg"
                  >
                    <Star className="w-2.5 h-2.5 fill-current" />
                    الأكثر طلباً
                  </motion.span>
                )}
                {product.preparation_type === 'made_to_order' && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, ease }}
                    className="bg-bg-base/70 backdrop-blur-sm border border-gold/30 text-gold text-[9px] font-black px-3 py-1.5 rounded-full"
                  >
                    يُجهز خصيصاً
                  </motion.span>
                )}
              </div>

              {/* Bottom info strip on image */}
              <div className="absolute bottom-0 inset-x-0 p-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, ease }}
                  className="flex items-center gap-4"
                >
                  {[
                    { icon: Truck, label: 'توصيل سريع' },
                    { icon: ShieldCheck, label: 'جودة مضمونة' },
                    { icon: Clock, label: 'طازج يومياً' },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-white/70">
                      <Icon className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="w-full lg:w-[48%] flex flex-col py-6 lg:py-10">

            {/* Category breadcrumb */}
            {product.category && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ease }}>
                <Link
                  href={`/products?category=${product.category_id}`}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-gold/60 hover:text-gold font-black transition-colors mb-5"
                >
                  <span className="w-4 h-px bg-gold/40" />
                  {product.category.name_ar}
                </Link>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7, ease }}
              className="font-display font-light text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              {product.name_ar}
            </motion.h1>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease }}
              className="flex items-baseline gap-3 mb-8 pb-8 border-b border-gold-border/10"
            >
              <span className="font-display text-5xl text-gold tracking-tight tabular-nums">
                {price.toLocaleString('ar-EG')}
              </span>
              <span className="text-gold/40 text-lg font-light">جنيه</span>
              {quantity > 1 && (
                <span className="text-text-fade text-sm font-light mr-2">
                  = {total.toLocaleString('ar-EG')} جنيه للكمية
                </span>
              )}
            </motion.div>

            {/* Description */}
            {product.description_ar && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.36 }}
                className="text-text-secondary text-sm leading-[1.9] font-light mb-8"
              >
                {product.description_ar}
              </motion.p>
            )}

            {/* Prep time notice */}
            {product.preparation_type === 'made_to_order' && product.prep_duration_minutes && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="flex items-center gap-3 px-4 py-3 bg-gold/5 border border-gold/15 rounded-2xl mb-8 text-gold"
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">
                  يُجهز خصيصاً لك في حوالي {product.prep_duration_minutes} دقيقة
                </span>
              </motion.div>
            )}

            {/* Variants */}
            {variants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, ease }}
                className="mb-8"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold/50 font-black mb-4">اختر الحجم</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {variants.map(v => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          'relative py-3.5 px-3 rounded-2xl border text-center transition-all duration-300 active:scale-[0.97] overflow-hidden',
                          isSelected
                            ? 'border-gold bg-gold/8 shadow-[0_0_24px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.1)]'
                            : 'border-gold-border/12 bg-bg-card/40 hover:border-gold-border/30 hover:bg-bg-card/60'
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="variant-bg"
                            className="absolute inset-0 bg-gold/5 rounded-2xl"
                            transition={{ duration: 0.25, ease }}
                          />
                        )}
                        <span className={cn(
                          'relative block text-[11px] font-black uppercase tracking-wider mb-1',
                          isSelected ? 'text-gold' : 'text-text-secondary'
                        )}>
                          {v.name_ar}
                        </span>
                        <span className={cn(
                          'relative text-[11px] font-bold',
                          isSelected ? 'text-gold/80' : 'text-text-muted'
                        )}>
                          {Number(v.price).toLocaleString('ar-EG')} جنيه
                        </span>
                        {isSelected && (
                          <motion.div
                            layoutId="variant-indicator"
                            className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-gold"
                            transition={{ duration: 0.25, ease }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── QUANTITY + CTA (Desktop) ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ease }}
              className="hidden lg:flex flex-col gap-4"
            >
              {/* Quantity row */}
              <div className="flex items-center gap-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold/50 font-black">الكمية</p>
                <div className="flex items-center bg-bg-card/60 border border-gold-border/12 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/5 transition-all duration-200 active:scale-90"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-display text-xl text-text-primary select-none tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/5 transition-all duration-200 active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {quantity > 1 && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-gold font-display font-bold tabular-nums"
                  >
                    {total.toLocaleString('ar-EG')} جنيه
                  </motion.span>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handleAdd}
                disabled={added}
                className={cn(
                  'relative h-16 rounded-2xl text-[12px] font-black uppercase tracking-[0.22em] transition-all duration-500 overflow-hidden group',
                  added
                    ? 'bg-emerald-600/70 border border-emerald-500/30 text-white cursor-default'
                    : 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-text-on-gold shadow-[0_8px_32px_rgba(201,168,76,0.3)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.45)] hover:-translate-y-0.5 active:translate-y-0'
                )}
              >
                {/* Shine sweep on hover */}
                {!added && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-700" />
                  </div>
                )}
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="flex items-center justify-center gap-2.5"
                    >
                      <Check className="w-5 h-5" />
                      تمت الإضافة للسلة!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="flex items-center justify-center gap-2.5"
                    >
                      <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      أضف للسلة
                      {quantity > 1 && (
                        <span className="text-text-on-gold/70 font-medium text-[11px]">({quantity} قطعة)</span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:block origin-right h-px bg-gradient-to-l from-gold/20 via-gold-border/10 to-transparent mt-8 mb-6"
            />

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="hidden lg:block text-[10px] text-text-fade text-center font-light tracking-wider"
            >
              🔒 دفع آمن · توصيل مضمون · جودة فاخرة مضمونة
            </motion.p>

          </div>
        </div>
      </section>

      {/* ──────────────────────── MOBILE STICKY BAR ──────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-bg-base/96 backdrop-blur-2xl border-t border-gold-border/12"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3">

          {/* Price column */}
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-text-fade mb-0.5">الإجمالي</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={total}
                initial={{ y: 4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -4, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="font-display text-xl text-gold font-semibold tabular-nums"
              >
                {total.toLocaleString('ar-EG')}
                <span className="text-xs text-gold/50 mr-1">جنيه</span>
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Quantity */}
          <div className="flex items-center bg-bg-card/60 border border-gold-border/12 rounded-xl px-1 h-11 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-gold rounded-lg active:scale-90 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-8 text-center font-display text-base text-text-primary tabular-nums"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-gold rounded-lg active:scale-90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={added}
            className={cn(
              'flex-[2] h-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-400 active:scale-[0.97] relative overflow-hidden',
              added
                ? 'bg-emerald-600/70 text-white cursor-default'
                : 'bg-gradient-to-r from-gold via-gold-light to-gold text-text-on-gold shadow-[0_4px_20px_rgba(201,168,76,0.3)]'
            )}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  تمت الإضافة!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  أضف للسلة
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </div>
      </div>

      {/* spacer for mobile bar */}
      <div className="lg:hidden h-[76px]" />

    </div>
  );
}
