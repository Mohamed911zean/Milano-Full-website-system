'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useMotionValue } from 'framer-motion';
import { useSpring } from 'framer-motion';

const CATEGORIES = [
  'الكل',
  'الكيكات',
  'المعجنات',
  'فطير',
  'الشوكولاتة',
  'الموسمي',
];

const PRODUCTS = [
  {
    id: 1,
    name: 'كيكة اللوتس',
    category: 'الكيكات',
    priceText: '٤٥٠ ج.م',
    price: 450,
    image: '/cake/lotus.jpg',
    available: true,
  },
  {
    id: 2,
    name: 'كيكة المانجو',
    category: 'الكيكات',
    priceText: '٤٨٠ ج.م',
    price: 480,
    image: '/cake/mango.jpg',
    available: false,
  },
  {
    id: 3,
    name: 'كيكة النوتيلا',
    category: 'الكيكات',
    priceText: '٥٠٠ ج.م',
    price: 500,
    image: '/cake/nutella.jpg',
    available: true,
  },
  {
    id: 4,
    name: 'فراولة فدج',
    category: 'المعجنات',
    priceText: '٣٥٠ ج.م',
    price: 350,
    image: '/cake/strawberry-vadge.jpg',
    available: true,
  },
  {
    id: 5,
    name: 'فطير بالعسل',
    category: 'فطير',
    priceText: '٢٨٠ ج.م',
    price: 280,
    image: '/soggy/honey-soggy.jpg',
    available: true,
  },
  {
    id: 6,
    name: 'كيكة الفورست',
    category: 'الكيكات',
    priceText: '٤٦٠ ج.م',
    price: 460,
    image: '/cake/forest.jpg',
    available: true,
  },
  {
    id: 7,
    name: 'كيكة الفور سيزون',
    category: 'الكيكات',
    priceText: '٥٢٠ ج.م',
    price: 520,
    image: '/cake/four-season.jpg',
    available: true,
  },
  {
    id: 8,
    name: 'فطير بالنوتيلا',
    category: 'فطير',
    priceText: '٣٠٠ ج.م',
    price: 300,
    image: '/soggy/nutell-soggy.jpg',
    available: true,
  },
];



// السهم متناسق تلقائياً مع اتجاه الـ RTL
function ArrowIcon() {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      className="rotate-180"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function CollectionIntro() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
const tiltX = useMotionValue(0);
const tiltY = useMotionValue(0);
const stX = useSpring(tiltX, { stiffness: 300, damping: 25 });
const stY = useSpring(tiltY, { stiffness: 300, damping: 25 });


  const filteredProducts = activeCategory === 'الكل'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleQuickAdd = (
    e: React.MouseEvent,
    product: typeof PRODUCTS[0],
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.available || addedMap[product.id]) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(
      () => setAddedMap(prev => ({ ...prev, [product.id]: false })),
      2000,
    );
  };

  return (
    <section className="section bg-bg-base relative overflow-hidden" dir="rtl">
      {/* Ambient bg */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold mb-4 block">
              تشكيلة ميلانو
            </span>
            <h2 className="text-h2 text-text-primary">
              استمتع بعالم من النكهات
            </h2>
          </motion.div>
        </div>

        {/* ── Category chips ── */}
        <div
          ref={scrollRef}
          className="cat-scroll flex items-center gap-5 mb-10 sm:mb-14 overflow-x-auto sm:justify-center sm:flex-wrap"
        >
          <span className="shrink-0 w-1 sm:hidden" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'shrink-0 px-5 py-2.5 rounded-full border',
                'text-[11px] font-bold uppercase tracking-[0.15em]',
                'transition-all duration-300 whitespace-nowrap',
                'min-h-[38px]',
                activeCategory === cat
                  ? 'bg-gold border-gold text-text-on-gold'
                  : 'border-gold-border/25 text-text-muted hover:border-gold-border hover:text-gold'
              )}
            >
              {cat}
            </button>
          ))}
          <span className="shrink-0 w-1 sm:hidden" />
        </div>

        {/* ── Product Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {filteredProducts.map((product, index) => {
              const isTall = index % 2 === 0;
              const isAdded = !!addedMap[product.id];

              return (
               <motion.div
  key={product.id}
  style={hovered === product.id ? { rotateX: stY, rotateY: stX, transformStyle: 'preserve-3d' } : {}}
  onMouseMove={(e) => {
    if (hovered !== product.id) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    tiltY.set(-((e.clientY - rect.top) / rect.height - 0.5) * 12);
  }}
  onMouseEnter={() => setHovered(product.id)}
  onMouseLeave={() => { setHovered(null); tiltX.set(0); tiltY.set(0); }}
  className="group will-change-transform"
>
  <div className={cn(
    'relative bg-bg-card rounded-2xl overflow-hidden flex flex-col h-full',
    'border transition-all duration-700',
    hovered === product.id
      ? 'border-gold/25 shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(201,168,76,0.12)]'
      : 'border-gold-border/10 hover:border-gold-border/20',
    'text-right'
  )}>

                    {/* ── Image ── */}
                    <div className={cn(
                      'relative w-full overflow-hidden',
                      isTall
                        ? 'aspect-[3/4] lg:aspect-[4/5]'
                        : 'aspect-square lg:aspect-[4/5]'
                    )}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        quality={85}
                      />

                      {/* Bottom fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-2.5 right-2.5 flex">
                        {product.available === false ? (
                          <span className="flex items-center gap-1 bg-red-500 text-white
                                           text-[9px] font-bold px-2 py-1 rounded-full
                                           uppercase tracking-wide leading-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                            نفذت الكمية
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-emerald-500/90 text-white
                                           text-[9px] font-bold px-2 py-1 rounded-full
                                           uppercase tracking-wide leading-none backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                            متاح
                          </span>
                        )}
                      </div>

                      {/* Wishlist */}
                      <button
                        aria-label="Add to wishlist"
                        className={cn(
                          'absolute top-2.5 left-2.5 w-7 h-7 rounded-full',
                          'bg-black/25 backdrop-blur-sm border border-white/15',
                          'flex items-center justify-center',
                          'hover:bg-black/50 active:scale-95 transition-all duration-200'
                        )}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>

                      {/* Desktop: hover quick-add */}
                      <div className={cn(
                        'absolute bottom-3 left-3 right-3',
                        'opacity-0 translate-y-2',
                        'group-hover:opacity-100 group-hover:translate-y-0',
                        'transition-all duration-300',
                        'hidden sm:block'
                      )}>
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          disabled={product.available === false}
                          className={cn(
                            'w-full py-2 min-h-[36px] rounded-xl',
                            'text-[10px] font-black uppercase tracking-[0.15em]',
                            'flex items-center justify-center gap-1.5',
                            'transition-all duration-300 active:scale-95',
                            product.available === false
                              ? 'opacity-40 cursor-not-allowed bg-gray-500/50 text-white'
                              : isAdded
                              ? 'bg-emerald-600/80 text-white'
                              : 'bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold shadow-[0_4px_16px_rgba(212,169,79,0.35)] hover:shadow-[0_6px_20px_rgba(212,169,79,0.5)]'
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {isAdded ? (
                              <motion.span
                                key="done"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                تم الإضافة
                              </motion.span>
                            ) : (
                              <motion.span
                                key="add"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                إضافة سريعة
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>

                    {/* ── Info ── */}
                    <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
                      <h4 className={cn(
                        'text-text-primary font-medium leading-snug line-clamp-1',
                        'text-[12px] sm:text-[13px]',
                        'group-hover:text-gold transition-colors duration-300'
                      )}>
                        {product.name}
                      </h4>

                      <p className="text-text-muted text-[10px] sm:text-[11px] line-clamp-1">
                        {product.category}
                      </p>

                      <div className={cn(
                        'flex items-center justify-between mt-auto pt-2',
                        'flex-row-reverse'
                      )}>
                        <p className={cn(
                          'text-gold font-bold text-[12px] sm:text-[13px] tracking-wide',
                          product.available === false && 'opacity-40'
                        )}>
                          {product.priceText}
                        </p>

                        {/* Mobile: quick-add button */}
                        <button
                          onClick={(e) => {
                            if (!product.available) return;
                            handleQuickAdd(e, product);
                          }}
                          disabled={product.available === false}
                          aria-label={`إضافة ${product.name} إلى السلة`}
                          className={cn(
                            'w-8 h-8 rounded-full shrink-0',
                            'flex items-center justify-center',
                            'active:scale-90 transition-all duration-300',
                            'sm:hidden',
                            product.available === false
                              ? 'opacity-30 cursor-not-allowed border border-gold-border/15 text-text-fade'
                              : isAdded
                              ? 'bg-emerald-600/70 border border-emerald-500/30 text-white'
                              : 'border border-gold-border/20 bg-bg-base text-gold hover:bg-gold hover:border-gold hover:text-text-on-gold'
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {isAdded ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="plus"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>

                        {/* Desktop arrow — navigates to product page */}
                        <Link
                          href={`/products/${product.id}`}
                          aria-label={product.name}
                          className={cn(
                            'w-8 h-8 rounded-full shrink-0',
                            'border border-gold-border/20 bg-bg-base',
                            'hidden sm:flex items-center justify-center',
                            'text-gold hover:bg-gold hover:border-gold hover:text-text-on-gold',
                            'active:scale-95 transition-all duration-300'
                          )}
                        >
                          <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Show More ── */}
        <div className="mt-8 sm:mt-10">
          <Link href="/shop" className="block sm:flex sm:justify-center">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                'w-full sm:w-auto min-h-[44px] px-10',
                'border-gold-border/30 hover:border-gold',
                'flex items-center justify-center gap-2'
              )}
            >
              عرض المزيد
              <ArrowIcon />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}