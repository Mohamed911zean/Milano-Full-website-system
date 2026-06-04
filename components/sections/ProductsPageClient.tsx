'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { ShoppingBag, Check, SlidersHorizontal, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { Category, ProductWithVariants } from '@/lib/supabase/types';

interface Props {
  categories: Category[];
  products: ProductWithVariants[];
  activeCategory: Category | null;
  activeCategoryId?: string;
}

const ease: Transition['ease'] = [0.22, 1, 0.36, 1];

export default function ProductsPageClient({ categories, products, activeCategory, activeCategoryId }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = products.filter(p =>
    p.name_ar.includes(search) || (p.description_ar ?? '').includes(search)
  );

  const handleAdd = (e: React.MouseEvent, product: ProductWithVariants) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants?.find(v => v.is_default) ?? product.variants?.[0];
    const price = defaultVariant?.price ?? product.base_price;
    addItem({ id: product.id, name: product.name_ar, price: Number(price), image: product.images?.[0] ?? '' });
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-base" dir="rtl">
      {/* ── Header Banner ── */}
      <div className="relative h-[320px] sm:h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/40 via-bg-base/70 to-bg-base" />
        <div className="absolute inset-0 bg-[url('/cakes-category.jpg')] bg-cover bg-center opacity-20" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-bold block mb-4">
              الرئيسية / {activeCategory ? activeCategory.name_ar : 'المنتجات'}
            </span>
            <h1 className="font-display font-light text-white leading-none mb-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              {activeCategory ? activeCategory.name_ar : 'قائمة الحلويات'}
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </motion.div>
        </div>
      </div>

      {/* ── Category Pills (mobile sticky) ── */}
      <div className="lg:hidden sticky top-0 z-30 bg-bg-base/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <Link href="/products"
            className={cn('flex-none text-[11px] px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap font-bold',
              !activeCategoryId ? 'bg-gold border-gold text-text-on-gold' : 'border-gold-border/20 text-text-muted hover:text-gold hover:border-gold/40'
            )}>
            الكل
          </Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}
              className={cn('flex-none text-[11px] px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap font-bold',
                activeCategoryId === cat.id ? 'bg-gold border-gold text-text-on-gold' : 'border-gold-border/20 text-text-muted hover:text-gold hover:border-gold/40'
              )}>
              {cat.name_ar}
            </Link>
          ))}
        </div>
      </div>

      <div className="container pb-32 pt-8">
        <div className="flex gap-16">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-10">
              {/* Search */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">بحث</h4>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-12 bg-bg-card/50 border border-gold-border/15 rounded-xl pr-5 pl-11 text-sm text-text-primary focus:border-gold/50 outline-none transition-all placeholder:text-text-fade"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-gold transition-colors" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">الأقسام</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/products"
                      className={cn('flex items-center gap-3 py-2 text-sm transition-all duration-300 group',
                        !activeCategoryId ? 'text-gold' : 'text-text-muted hover:text-gold'
                      )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full transition-all',
                        !activeCategoryId ? 'bg-gold' : 'bg-gold/0 group-hover:bg-gold'
                      )} />
                      جميع المنتجات
                    </Link>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link href={`/products?category=${cat.id}`}
                        className={cn('flex items-center gap-3 py-2 text-sm transition-all duration-300 group',
                          activeCategoryId === cat.id ? 'text-gold -translate-x-1' : 'text-text-muted hover:text-gold hover:-translate-x-0.5'
                        )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full transition-all',
                          activeCategoryId === cat.id ? 'bg-gold shadow-[0_0_6px_rgba(201,168,76,0.6)]' : 'bg-gold/0 group-hover:bg-gold'
                        )} />
                        {cat.name_ar}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* ── Products Grid ── */}
          <main className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <p className="text-sm text-text-muted">
                <span className="text-gold font-bold">{filtered.length}</span> منتج
              </p>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm text-text-muted border border-gold-border/15 rounded-full px-4 py-2 hover:border-gold/40 hover:text-gold transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                تصفية
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-text-muted font-light">لا توجد منتجات في هذا القسم حتى الآن</p>
                <Link href="/products" className="inline-block mt-6 text-gold text-sm hover:text-gold-light transition-colors">
                  عرض جميع المنتجات ←
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((product, i) => {
                  const defaultVariant = product.variants?.find(v => v.is_default) ?? product.variants?.[0];
                  const price = Number(defaultVariant?.price ?? product.base_price);
                  const image = product.images?.[0];
                  const isAdded = !!addedMap[product.id];

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease, delay: i * 0.04 }}
                      className="group"
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="bg-bg-card border border-gold-border/10 rounded-2xl overflow-hidden transition-all duration-700 hover:border-gold/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]  hover:-translate-y-1">
                          {/* Image */}
                          <div className="relative aspect-[4/5] overflow-hidden bg-bg-elevated">
                            {image ? (
                              <>
                                <Image
                                  src={image}
                                  alt={product.name_ar}
                                  fill
                                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="font-display text-gold/20 text-4xl">M</span>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              {product.is_featured && (
                                <span className="bg-gold text-text-on-gold text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
                                  الأكثر طلباً
                                </span>
                              )}
                              {product.preparation_type === 'made_to_order' && (
                                <span className="bg-bg-base/70 backdrop-blur-sm border border-gold/30 text-gold text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">
                                  يُجهز خصيصاً
                                </span>
                              )}
                            </div>

                            {/* Quick add (desktop hover) */}
                            <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                              <button
                                onClick={e => handleAdd(e, product)}
                                className={cn(
                                  'w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5',
                                  isAdded ? 'bg-emerald-600/85 text-white' : 'bg-gold/90 text-text-on-gold'
                                )}>
                                {isAdded ? <><Check className="w-3 h-3" /> تم الإضافة</> : <><ShoppingBag className="w-3 h-3" /> أضف للسلة</>}
                              </button>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4">
                            {/* Gold reveal line */}
                            <div className="h-px w-0 bg-gradient-to-r from-gold to-transparent group-hover:w-full transition-all duration-700 mb-3" />
                            <h3 className="text-text-primary font-bold text-sm sm:text-base group-hover:text-gold transition-colors duration-500 leading-snug line-clamp-1 mb-1">
                              {product.name_ar}
                            </h3>
                            {product.description_ar && (
                              <p className="text-text-fade text-[11px] font-light line-clamp-1 mb-3">
                                {product.description_ar}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="font-display text-gold font-bold text-lg">
                                {price.toLocaleString('ar-EG')} جنيه
                              </span>
                              {/* Mobile add button */}
                              <button
                                onClick={e => handleAdd(e, product)}
                                className={cn(
                                  'sm:hidden w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-90',
                                  isAdded ? 'bg-emerald-600/70 border-emerald-500/30 text-white' : 'border-gold/20 bg-gold/5 text-gold hover:bg-gold hover:text-text-on-gold'
                                )}>
                                <AnimatePresence mode="wait">
                                  {isAdded
                                    ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="w-3.5 h-3.5" /></motion.span>
                                    : <motion.span key="b" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><ShoppingBag className="w-3.5 h-3.5" /></motion.span>
                                  }
                                </AnimatePresence>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-xs bg-bg-base border-l border-white/5 p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-gold font-black text-sm uppercase tracking-widest">الأقسام</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-gold transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" onClick={() => setMobileFiltersOpen(false)}
                    className={cn('block py-3 border-b border-white/5 text-sm transition-colors', !activeCategoryId ? 'text-gold font-bold' : 'text-text-muted')}>
                    جميع المنتجات
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/products?category=${cat.id}`} onClick={() => setMobileFiltersOpen(false)}
                      className={cn('block py-3 border-b border-white/5 text-sm transition-colors', activeCategoryId === cat.id ? 'text-gold font-bold' : 'text-text-muted')}>
                      {cat.name_ar}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
