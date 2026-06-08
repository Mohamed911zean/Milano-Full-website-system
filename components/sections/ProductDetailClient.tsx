'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, type Transition } from 'framer-motion';
import {
  Minus, Plus, ShoppingBag, Heart, ChevronDown,
  Truck, ShieldCheck, Clock, ChevronRight, Check, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import type { Category, ProductWithVariants } from '@/lib/supabase/types';

const ease: Transition['ease'] = [0.22, 1, 0.36, 1];

function Accordion({ title, content, index }: { title: string; content: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold-border/10 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 group">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-gold/30 tabular-nums">0{index + 1}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-secondary group-hover:text-gold transition-colors">{title}</span>
        </div>
        <div className={cn('w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-500',
          open ? 'border-gold/50 bg-gold/10' : 'border-gold-border/20 group-hover:border-gold/30')}>
          <ChevronDown className={cn('w-3 h-3 transition-all duration-300', open ? 'text-gold rotate-180' : 'text-text-muted')} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-9 text-sm text-text-muted leading-relaxed">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  product: ProductWithVariants & { category: Category | null };
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const imgRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  const defaultVariant = product.variants?.find(v => v.is_default) ?? product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant ?? null);
  const [quantity, setQuantity] = useState(1);
  const [cakeText, setCakeText] = useState('');
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const price = Number(selectedVariant?.price ?? product.base_price);
  const image = product.images?.[0];

  const handleAdd = () => {
    if (added) return;
    addItem({
      id: product.id,
      name: `${product.name_ar}${selectedVariant ? ` — ${selectedVariant.name_ar}` : ''}`,
      price,
      image: image ?? '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const details = [
    product.description_ar && { title: 'وصف المنتج', content: product.description_ar },
    product.preparation_type === 'made_to_order' && product.prep_duration_minutes && {
      title: 'وقت التحضير',
      content: `هذا المنتج يُجهز خصيصاً لك، يستغرق حوالي ${product.prep_duration_minutes} دقيقة.`
    },
  ].filter(Boolean) as { title: string; content: string }[];

  return (
    <div className="bg-bg-base min-h-screen overflow-x-hidden" dir="rtl">
      {/* Ambient */}
      <div className="fixed top-0 right-0  h-[500px] bg-gold/4 blur-[160px] rounded-full pointer-events-none z-0" />

      {/* Breadcrumb */}
      <div className="container relative z-10 pt-24 pb-2">
        <nav className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-text-fade hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronRight className="w-3 h-3 text-gold-border/30" />
          <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-text-fade hover:text-gold transition-colors">المنتجات</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-gold-border/30" />
              <Link href={`/products?category=${product.category_id}`}
                className="text-[10px] uppercase tracking-[0.2em] text-text-fade hover:text-gold transition-colors">
                {product.category.name_ar}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-gold-border/30" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold truncate max-w-[140px]">{product.name_ar}</span>
        </nav>
      </div>

      {/* Hero split */}
      <section className="relative z-10 flex flex-col lg:flex-row">

        {/* Image */}
        <div ref={imgRef}
          className="lg:sticky lg:top-[80px] lg:self-start w-full lg:w-[52%] relative overflow-hidden"
          style={{ height: 'clamp(360px, 55vw, calc(100vh - 80px))' }}>
          <motion.div className="absolute inset-0 will-change-transform" style={{ scale: imgScale, y: imgY }}>
            {image ? (
              <Image src={image} alt={product.name_ar} fill className="object-cover object-center" priority
                sizes="(max-width: 1024px) 100vw, 52vw" quality={95} />
            ) : (
              <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                <span className="font-display text-gold/20 text-8xl font-bold">M</span>
              </div>
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/50 via-transparent to-bg-base/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-base/20 lg:to-bg-base/30" />

          {/* Badges overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.is_featured && (
              <span className="bg-gold text-text-on-gold text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                الأكثر طلباً
              </span>
            )}
            {product.preparation_type === 'made_to_order' && (
              <span className="bg-bg-base/70 backdrop-blur-sm border border-gold/30 text-gold text-[9px] font-black px-3 py-1 rounded-full">
                يُجهز خصيصاً
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={cn('absolute top-4 left-4 w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all duration-500',
              wishlisted ? 'bg-gold border-gold text-text-on-gold' : 'bg-bg-base/50 border-white/10 text-text-muted hover:text-gold hover:border-gold/30'
            )}>
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
          </button>
        </div>

        {/* Info */}
        <div className="w-full lg:w-[48%] flex flex-col px-5 sm:px-8 lg:px-12 py-8 lg:py-16 relative z-10">

          {/* Category */}
          {product.category && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ease }}>
              <Link href={`/products?category=${product.category_id}`}
                className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold hover:text-gold transition-colors mb-4 block">
                {product.category.name_ar}
              </Link>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7, ease }}
            className="font-display font-light text-white leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {product.name_ar}
          </motion.h1>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, ease }}
            className="flex items-baseline gap-3 mb-8 pb-8 border-b border-gold-border/10">
            <span className="font-display text-4xl sm:text-5xl text-gold tracking-tight">
              {price.toLocaleString('ar-EG')}
            </span>
            <span className="text-gold/40 font-light tracking-widest">جنيه</span>
          </motion.div>

          {/* Description */}
          {product.description_ar && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-text-secondary text-sm leading-[1.9] mb-8">
              {product.description_ar}
            </motion.p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46, ease }} className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold/50 font-black mb-3">اختر الحجم</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map(v => (
                  <button key={v.id} onClick={() => setSelectedVariant(v)}
                    className={cn('py-3 px-2 rounded-2xl border text-center transition-all duration-300 active:scale-[0.97]',
                      selectedVariant?.id === v.id
                        ? 'border-gold bg-gold/8 shadow-[0_0_16px_rgba(201,168,76,0.1)]'
                        : 'border-gold-border/15 bg-bg-card/30 hover:border-gold-border/35'
                    )}>
                    <span className={cn('block text-[11px] font-black uppercase tracking-wider mb-1',
                      selectedVariant?.id === v.id ? 'text-gold' : 'text-text-secondary')}>
                      {v.name_ar}
                    </span>
                    <span className={cn('text-[11px] font-bold', selectedVariant?.id === v.id ? 'text-gold' : 'text-text-muted')}>
                      {Number(v.price).toLocaleString('ar-EG')} جنيه
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cake text */}
          {product.allows_text_on_cake && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8">
              <label className="text-[10px] uppercase tracking-[0.25em] text-gold/50 font-black block mb-3">
                الكتابة على الكيكة (اختياري)
              </label>
              <input
                type="text" value={cakeText} onChange={e => setCakeText(e.target.value)}
                placeholder='مثال: عيد ميلاد سعيد يا محمد'
                className="w-full h-12 bg-bg-card/50 border border-gold-border/15 rounded-xl px-4 text-sm text-text-primary focus:border-gold outline-none transition-all placeholder:text-text-fade"
              />
            </motion.div>
          )}

          {/* Prep time */}
          {product.preparation_type === 'made_to_order' && product.prep_duration_minutes && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
              className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/10 rounded-xl mb-8 text-gold">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">
                يُجهز خصيصاً لك في حوالي {product.prep_duration_minutes} دقيقة
              </span>
            </motion.div>
          )}

          {/* Quantity + CTA (desktop) */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, ease }}
            className="hidden lg:flex gap-3 mb-8">
            {/* Qty */}
            <div className="flex items-center bg-bg-card/50 border border-gold-border/15 rounded-2xl px-1 gap-0.5 h-14 shrink-0">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-xl hover:bg-gold/5">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-display text-lg text-text-primary select-none">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-xl hover:bg-gold/5">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* CTA */}
            <button onClick={handleAdd}
              className={cn('flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-500 relative overflow-hidden group',
                added
                  ? 'bg-emerald-600/70 border border-emerald-500/30 text-white'
                  : 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-text-on-gold shadow-[0_6px_28px_rgba(201,168,76,0.28)] hover:shadow-[0_10px_36px_rgba(201,168,76,0.42)] hover:-translate-y-0.5'
              )}>
              <AnimatePresence mode="wait">
                {added
                  ? <motion.span key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> تمت الإضافة
                  </motion.span>
                  : <motion.span key="a" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" /> أضف للسلة
                  </motion.span>
                }
              </AnimatePresence>
              {/* Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-900" />
              </div>
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.64 }}
            className="grid grid-cols-3 gap-2 mb-10">
            {[
              { icon: Truck, label: 'توصيل سريع' },
              { icon: ShieldCheck, label: 'جودة مضمونة' },
              { icon: Clock, label: 'طازج يومياً' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-3 rounded-xl bg-bg-card/20 border border-gold-border/8 group hover:border-gold-border/20 transition-all duration-400">
                <div className="w-8 h-8 rounded-full bg-gold/5 border border-gold-border/10 flex items-center justify-center group-hover:bg-gold/10 transition-all">
                  <Icon className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="text-[9px] uppercase tracking-[0.1em] text-text-fade font-bold text-center">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Accordions */}
          {details.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="border-t border-gold-border/10">
              {details.map((d, i) => <Accordion key={i} title={d.title} content={d.content} index={i} />)}
            </motion.div>
          )}
        </div>
      </section>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-bg-base/96 backdrop-blur-2xl border-t border-gold-border/15"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <p className="text-[9px] uppercase tracking-widest text-text-fade mb-0.5">الإجمالي</p>
            <p className="font-display text-xl text-gold font-semibold tabular-nums">
              {(price * quantity).toLocaleString('ar-EG')} <span className="text-xs text-gold/50">جنيه</span>
            </p>
          </div>
          <div className="flex items-center bg-bg-card/50 border border-gold-border/15 rounded-xl px-1 h-11 gap-0.5 shrink-0">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-gold rounded-lg active:scale-90 transition-colors">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-display text-base text-text-primary">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-gold rounded-lg active:scale-90 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={handleAdd}
            className={cn('flex-[2] h-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-[0.97]',
              added ? 'bg-emerald-600/70 text-white' : 'bg-gradient-to-r from-gold via-gold-light to-gold text-text-on-gold shadow-[0_4px_16px_rgba(201,168,76,0.3)]'
            )}>
            <AnimatePresence mode="wait">
              {added
                ? <motion.span key="d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> تمت الإضافة!</motion.span>
                : <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"><ShoppingBag className="w-4 h-4" /> أضف للسلة</motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>
      <div className="lg:hidden h-[72px]" />
    </div>
  );
}
