'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Minus, Plus, ShoppingBag, Heart, ChevronDown,
  Truck, ShieldCheck, Clock, ArrowLeft, ArrowRight,
  Share2, Star, ChevronRight, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PRODUCT = {
  id: 7,
  name: 'Four Seasons Cake',
  subtitle: 'A French Classic, Reimagined',
  category: 'Ice Cream Cakes',
  price: 550,
  rating: 4.9,
  reviewCount: 128,
  description:
    'Layers of caramelized flaky puff pastry meet our signature creamy vanilla bean ice cream, crowned with forest berries and a golden caramel veil. A temperature contrast that lingers long after the last bite.',
  image: '/cake/four-season.jpg',
  variants: [
    { label: 'Small', sub: '4–6 persons', price: 550 },
    { label: 'Medium', sub: '8–10 persons', price: 750 },
    { label: 'Large', sub: '12–15 persons', price: 980 },
  ],
  details: [
    {
      title: 'The Craft',
      content:
        'Handcrafted daily using traditional French techniques. Each layer of puff pastry is meticulously caramelized to ensure a perfect crunch that contrasts beautifully with our smooth, artisanal ice cream.',
    },
    {
      title: 'Ingredients & Allergens',
      content:
        'Wheat Flour, Butter, Milk, Cream, Vanilla Bean, Sugar, Eggs, Seasonal Berries. Contains Gluten, Dairy, Eggs. May contain traces of nuts.',
    },
    {
      title: 'Storage & Shelf Life',
      content:
        'Keep frozen at -18°C. Remove from freezer 10 minutes before serving for the ideal texture. Best consumed within 7 days of purchase.',
    },
  ],
  relatedProducts: [
    { id: 1, name: 'Lotus Cake', price: 450, image: '/cake/lotus.jpg', category: 'Cakes' },
    { id: 3, name: 'Nutella Cake', price: 500, image: '/cake/nutella.jpg', category: 'Cakes' },
    { id: 5, name: 'Forest Berry', price: 460, image: '/cake/forest.jpg', category: 'Cakes' },
    { id: 2, name: 'Mango Cake', price: 480, image: '/cake/mango.jpg', category: 'Cakes' },
  ],
};

/* ─────────────────────────────────────────────
   ACCORDION
───────────────────────────────────────────── */
function Accordion({ title, content, index }: { title: string; content: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold-border/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group min-h-[56px]"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-gold/30 tabular-nums shrink-0">0{index + 1}</span>
          <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-text-secondary group-hover:text-gold transition-colors duration-300">
            {title}
          </span>
        </div>
        <div className={cn(
          'w-7 h-7 rounded-full border shrink-0 flex items-center justify-center transition-all duration-500',
          open ? 'border-gold/60 bg-gold/10' : 'border-gold-border/20 group-hover:border-gold/40'
        )}>
          <ChevronDown className={cn('w-3 h-3 transition-all duration-300', open ? 'text-gold rotate-180' : 'text-text-muted')} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-9 pr-2 text-sm text-text-muted leading-relaxed tracking-wide">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RELATED PRODUCTS CAROUSEL
───────────────────────────────────────────── */
function RelatedCarousel({
  products,
  onAddToCart,
  addedMap,
}: {
  products: typeof PRODUCT.relatedProducts;
  onAddToCart: (e: React.MouseEvent, p: typeof PRODUCT.relatedProducts[0]) => void;
  addedMap: Record<number, boolean>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -(el.clientWidth * 0.8) : el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative">

      {/* Desktop arrow controls */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-12 right-0 z-10">
        <button
          onClick={() => scroll('left')}
          disabled={!canLeft}
          className={cn(
            'w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300',
            canLeft
              ? 'border-gold-border/40 text-gold hover:bg-gold/8 hover:border-gold/50 active:scale-95'
              : 'border-gold-border/10 text-text-fade opacity-30 cursor-not-allowed'
          )}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canRight}
          className={cn(
            'w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300',
            canRight
              ? 'border-gold-border/40 text-gold hover:bg-gold/8 hover:border-gold/50 active:scale-95'
              : 'border-gold-border/10 text-text-fade opacity-30 cursor-not-allowed'
          )}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Track — full-bleed on mobile */}
      <div
        ref={trackRef}
        onScroll={sync}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`.carousel-track::-webkit-scrollbar{display:none}`}</style>

        {/* Leading padding on mobile so first card isn't flush */}
        <div className="shrink-0 w-0.5 sm:hidden" />

        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            viewport={{ once: true }}
            className="shrink-0 w-[190px] sm:w-[230px] group"
          >
            <Link href={`/products/${p.id}`}>
              <div className="bg-bg-card border border-gold-border/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold-border/35 hover:shadow-hover hover:-translate-y-1 active:scale-[0.97]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="230px"
                    quality={80}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-bg-base/65 backdrop-blur-md text-gold text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.15em] border border-gold-border/20">
                      {p.category}
                    </span>
                  </div>
                  {/* Hover quick-add label */}
                  <div
                    className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 hidden sm:block"
                    onClick={(e) => onAddToCart(e, p)}
                  >
                    <div className={cn(
                      'backdrop-blur-sm text-[9px] font-black uppercase tracking-[0.18em] py-2 rounded-xl text-center transition-all duration-300',
                      addedMap[p.id]
                        ? 'bg-emerald-600/85 text-white'
                        : 'bg-gold/85 text-text-on-gold'
                    )}>
                      {addedMap[p.id] ? 'Added!' : 'Quick Add'}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base text-text-primary mb-2 leading-tight group-hover:text-gold transition-colors duration-300 line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-sm">{p.price} <span className="text-[10px] text-gold/55">EGP</span></span>
                    <button
                      onClick={(e) => onAddToCart(e, p)}
                      aria-label={`Add ${p.name} to cart`}
                      className={cn(
                        'w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-90',
                        addedMap[p.id]
                          ? 'border-emerald-500/40 bg-emerald-600/70 text-white'
                          : 'border-gold-border/15 text-text-fade group-hover:border-gold group-hover:text-gold'
                      )}
                    >
                      {addedMap[p.id] ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Trailing padding on mobile */}
        <div className="shrink-0 w-0.5 sm:hidden" />
      </div>

      {/* Right-edge fade hint on mobile to signal more content */}
      <div className="pointer-events-none absolute top-0 right-0 w-10 h-[calc(100%-12px)] bg-gradient-to-l from-bg-base to-transparent sm:hidden" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedAddedMap, setRelatedAddedMap] = useState<Record<number, boolean>>({});

  const { addItem } = useCart();

  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const currentVariant = PRODUCT.variants[selectedVariant];

  const handleAddToCart = () => {
    if (addedToCart) return;
    // Use variant-specific id so each size is a distinct cart entry
    addItem({
      id: PRODUCT.id * 100 + selectedVariant,
      name: `${PRODUCT.name} – ${currentVariant.label}`,
      price: currentVariant.price,
      image: PRODUCT.image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  };

  const handleRelatedAdd = (e: React.MouseEvent, product: typeof PRODUCT.relatedProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (relatedAddedMap[product.id]) return;
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setRelatedAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setRelatedAddedMap(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <>
      <div className="bg-bg-base min-h-screen relative overflow-x-hidden">

        {/* ── AMBIENT GLOWS ── */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gold/4 blur-[180px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-1/3 left-0 w-[400px] h-[400px] bg-gold/3 blur-[140px] rounded-full pointer-events-none z-0" />

        {/* ══════════════════════════════════════════
            BREADCRUMB
            pt-24 = ~96px which clears the fixed Navbar height
        ══════════════════════════════════════════ */}
        <div className="container relative z-10 pt-24 pb-3">
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-2 flex-wrap"
          >
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.25em] text-text-fade hover:text-gold transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gold-border/30 shrink-0" />
            <Link
              href="/shop"
              className="text-[10px] uppercase tracking-[0.25em] text-text-fade hover:text-gold transition-colors duration-300 font-medium"
            >
              Shop
            </Link>
            <ChevronRight className="w-3 h-3 text-gold-border/30 shrink-0" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-text-secondary font-bold truncate max-w-[160px] sm:max-w-none">
              {PRODUCT.name}
            </span>
          </motion.nav>
        </div>

        {/* ══════════════════════════════════════════
            HERO — SINGLE IMAGE + INFO SPLIT
        ══════════════════════════════════════════ */}
        <section className="relative z-10 flex flex-col lg:flex-row">

          {/* ─── LEFT: SINGLE PRODUCT IMAGE ─── */}
          {/*
            On desktop: sticky so it stays in view while user scrolls info.
            On mobile: natural aspect-ratio block, no sticky.
            top value matches Navbar height (~80px) so it docks just below it.
          */}
          <div
            ref={imgRef}
            className="lg:sticky lg:top-[80px] lg:self-start w-full lg:w-[52%] relative overflow-hidden"
            style={{ height: 'clamp(360px, 60vw, calc(100vh - 80px))' }}
          >
            {/* Parallax wrapper — only meaningful on desktop scroll */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{ y: imgY, scale: imgScale }}
            >
              <Image
                src={PRODUCT.image}
                alt={PRODUCT.name}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                quality={95}
              />
            </motion.div>

            {/* Directional gradients for clean blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/55 via-transparent to-bg-base/25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-base/15 lg:to-bg-base/35 pointer-events-none" />

            {/* Top bar: category badge + action buttons */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-bg-base/55 backdrop-blur-xl text-gold text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.22em] border border-gold-border/25"
              >
                {PRODUCT.category}
              </motion.span>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-2"
              >
                <button
                  className="w-10 h-10 rounded-full bg-bg-base/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all duration-300 active:scale-90"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={cn(
                    'w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all duration-500 active:scale-90',
                    wishlisted
                      ? 'bg-gold border-gold text-text-on-gold shadow-[0_0_18px_rgba(212,169,79,0.5)]'
                      : 'bg-bg-base/50 border-white/10 text-text-muted hover:text-gold hover:border-gold/30'
                  )}
                >
                  <Heart className={cn('w-4 h-4 transition-all duration-300', wishlisted && 'fill-current scale-110')} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* ─── RIGHT: PRODUCT INFO ─── */}
          <div className="w-full lg:w-[48%] flex flex-col px-5 sm:px-8 lg:px-12 xl:px-14 py-8 lg:py-12 relative z-10">

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'w-3.5 h-3.5',
                      s <= Math.round(PRODUCT.rating) ? 'fill-gold text-gold' : 'text-gold-border/25'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gold font-bold">{PRODUCT.rating}</span>
              <span className="text-[11px] text-text-fade tracking-wide">({PRODUCT.reviewCount} reviews)</span>
            </motion.div>

            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.6 }}
              className="mb-6"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-bold mb-2">
                {PRODUCT.subtitle}
              </p>
              <h1
                className="font-display font-semibold text-text-primary leading-[1.06] tracking-tight"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
              >
                {PRODUCT.name}
              </h1>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="flex items-baseline gap-3 mb-7 pb-7 border-b border-gold-border/10"
            >
              <span className="font-display text-4xl sm:text-5xl text-gold tracking-tight">
                {currentVariant.price}
              </span>
              <span className="text-base text-gold/45 font-light tracking-widest">EGP</span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.44 }}
              className="text-text-secondary text-sm leading-[1.9] tracking-wide mb-8"
            >
              {PRODUCT.description}
            </motion.p>

            {/* ── VARIANT SELECTOR ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold/55 font-black mb-3">
                Select Size
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRODUCT.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={cn(
                      'relative py-3.5 px-2 rounded-2xl border text-center transition-all duration-400 active:scale-[0.96]',
                      selectedVariant === i
                        ? 'border-gold shadow-[0_0_20px_rgba(212,169,79,0.1)] bg-gold/6'
                        : 'border-gold-border/15 hover:border-gold-border/35 bg-bg-card/30'
                    )}
                  >
                    <span className={cn(
                      'block text-[11px] font-black uppercase tracking-wider mb-0.5 transition-colors',
                      selectedVariant === i ? 'text-gold' : 'text-text-secondary'
                    )}>
                      {v.label}
                    </span>
                    <span className="block text-[10px] text-text-fade tracking-wide leading-tight">
                      {v.sub}
                    </span>
                    <span className={cn(
                      'block text-[11px] font-bold mt-1.5 transition-colors',
                      selectedVariant === i ? 'text-gold' : 'text-text-muted'
                    )}>
                      {v.price} EGP
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── QUANTITY + CTA (desktop) ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 }}
              className="hidden lg:flex gap-3 mb-6"
            >
              {/* Quantity stepper */}
              <div className="flex items-center bg-bg-card/55 backdrop-blur-md border border-gold-border/15 rounded-2xl px-1 gap-0.5 h-14 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-xl hover:bg-gold/5 active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-display text-lg text-text-primary select-none tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-xl hover:bg-gold/5 active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CTA button */}
              <button
                onClick={handleAddToCart}
                className={cn(
                  'flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-500 relative overflow-hidden group',
                  addedToCart
                    ? 'bg-emerald-600/70 border border-emerald-500/30 text-white'
                    : 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-text-on-gold shadow-[0_6px_28px_rgba(212,169,79,0.28)] hover:shadow-[0_10px_36px_rgba(212,169,79,0.42)] hover:-translate-y-0.5'
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                          className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                        Added to Cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2.5"
                      >
                        <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-400" />
                        Reserve Now
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                {/* Shine sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-900" />
                </div>
              </button>
            </motion.div>

            {/* Mobile quantity row (above trust badges) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.54 }}
              className="lg:hidden flex items-center gap-3 mb-6"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-fade font-bold shrink-0">Qty:</p>
              <div className="flex items-center bg-bg-card/50 border border-gold-border/15 rounded-xl px-1 gap-0.5 h-11">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-lg active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-display text-base text-text-primary select-none tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-gold transition-colors rounded-lg active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* ── TRUST BADGES ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.64 }}
              className="grid grid-cols-3 gap-2 mb-10"
            >
              {[
                { icon: Truck, label: 'Same-day Delivery' },
                { icon: ShieldCheck, label: 'Artisanal Quality' },
                { icon: Clock, label: 'Freshly Crafted' },
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 py-3.5 rounded-xl bg-bg-card/20 border border-gold-border/8 hover:border-gold-border/22 transition-all duration-400 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/5 border border-gold-border/12 flex items-center justify-center group-hover:bg-gold/10 transition-all duration-400">
                    <Icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-text-fade font-bold text-center leading-tight px-1">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* ── ACCORDIONS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72 }}
              className="border-t border-gold-border/10"
            >
              {PRODUCT.details.map((d, i) => (
                <Accordion key={i} title={d.title} content={d.content} index={i} />
              ))}
            </motion.div>

          </div>
        </section>

        {/* ══════════════════════════════════════════
            RELATED PRODUCTS — HORIZONTAL CAROUSEL
        ══════════════════════════════════════════ */}
        <section className="relative z-10 py-16 sm:py-24 border-t border-gold-border/8">
          <div className="container">
            {/* Header */}
            <div className="flex items-end justify-between mb-10 sm:mb-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/45 font-black mb-2">
                  You May Also Desire
                </p>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-primary leading-tight">
                  From Our <span className="text-gold">Atelier</span>
                </h2>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-text-muted hover:text-gold transition-colors duration-300 group shrink-0 ml-4"
              >
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Carousel — negative margin so cards go edge-to-edge on mobile */}
            <div className="-mx-5 sm:-mx-8 lg:-mx-12 xl:-mx-16 px-5 sm:px-8 lg:px-12 xl:px-16">
              <RelatedCarousel
                products={PRODUCT.relatedProducts}
                onAddToCart={handleRelatedAdd}
                addedMap={relatedAddedMap}
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BOTTOM CTA CARD
        ══════════════════════════════════════════ */}
        <section className="relative z-10 border-t border-gold-border/8 py-14">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto text-center sm:text-left bg-bg-card/25 border border-gold-border/10 rounded-2xl px-7 py-8 sm:py-6 hover:border-gold-border/22 transition-all duration-500"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold/45 font-black mb-1">
                  Personalize Your Order
                </p>
                <h4 className="font-display text-xl text-text-primary">Need a Custom Cake?</h4>
              </div>
              <Link href="/special-cakes" className="shrink-0 w-full sm:w-auto">
                <Button variant="outline" size="default" className="w-full sm:w-auto">
                  Start Your Design
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            MOBILE STICKY BOTTOM ACTION BAR
            Hidden on lg+ since desktop has the inline CTA
        ══════════════════════════════════════════ */}
        <div
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-bg-base/96 backdrop-blur-2xl border-t border-gold-border/15"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Running total */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-widest text-text-fade leading-none mb-1">Total</p>
              <p className="font-display text-xl text-gold font-semibold leading-none tabular-nums">
                {currentVariant.price * quantity}
                <span className="text-xs text-gold/50 ml-1">EGP</span>
              </p>
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => setWishlisted(!wishlisted)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-400 active:scale-90 shrink-0',
                wishlisted
                  ? 'border-gold bg-gold/12 text-gold'
                  : 'border-gold-border/20 text-text-muted'
              )}
            >
              <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
            </button>

            {/* Reserve button */}
            <button
              onClick={handleAddToCart}
              className={cn(
                'flex-[2] h-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-[0.97] relative overflow-hidden',
                addedToCart
                  ? 'bg-emerald-600/70 text-white'
                  : 'bg-gradient-to-r from-gold via-gold-light to-gold text-text-on-gold shadow-[0_4px_20px_rgba(212,169,79,0.3)]'
              )}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 450 }}
                      className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                    Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Reserve Now
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Spacer so sticky bar doesn't cover page content */}
        <div className="lg:hidden h-[72px]" />

      </div>
    </>
  );
}