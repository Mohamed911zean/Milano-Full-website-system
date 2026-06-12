'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { SlidersHorizontal, X, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import type { Category, ProductWithVariants } from '@/lib/supabase/types';

interface Props {
  categories: Category[];
  products: ProductWithVariants[];
  activeCategory: Category | null;
  activeCategoryId?: string;
}

const ease: Transition['ease'] = [0.22, 1, 0.36, 1];

export default function ProductsPageClient({ categories, products, activeCategory, activeCategoryId }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter products
  const filtered = products.filter(p => {
    const matchesSearch = 
      p.name_ar.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      (p.description_ar ?? '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (p.name_en ?? '').toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || wishlistItems.some(w => w.id === p.id);
    return matchesSearch && matchesFavorites;
  });

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

      {/* ── Search & Filter Bar (Top) ── */}
      <div className="container pt-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-bg-card/50 border border-gold-border/15 rounded-xl pr-12 pl-4 text-sm text-text-primary focus:border-gold/50 outline-none transition-all placeholder:text-text-fade"
            />
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border px-5 h-12 text-sm font-bold transition-all active:scale-95',
              showFavoritesOnly
                ? 'border-red-500/50 bg-red-500/10 text-white'
                : 'border-white/10 bg-bg-card/50 text-text-muted hover:text-gold hover:border-gold/30'
            )}
          >
            <Heart className={cn('w-4 h-4', showFavoritesOnly && 'fill-current')} />
            <span>المفضلة</span>
            {wishlistItems.length > 0 && (
              <span className="rounded-full bg-gold/20 px-2 text-[10px] font-black text-gold">
                {wishlistItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 text-sm text-text-muted border border-gold-border/15 rounded-xl px-5 h-12 hover:border-gold/40 hover:text-gold transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            تصفية
          </button>
        </div>

        {/* ── Category Pills (All Screens) ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
          <Link href="/products"
            className={cn('flex-none text-[11px] px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap font-bold',
              !activeCategoryId ? 'bg-gold border-gold text-text-on-gold shadow-lg shadow-gold/20' : 'border-white/10 text-text-muted hover:text-gold hover:border-gold/30'
            )}>
            الكل
          </Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}
              className={cn('flex-none text-[11px] px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap font-bold',
                activeCategoryId === cat.id ? 'bg-gold border-gold text-text-on-gold shadow-lg shadow-gold/20' : 'border-white/10 text-text-muted hover:text-gold hover:border-gold/30'
              )}>
              {cat.name_ar}
            </Link>
          ))}
        </div>

        <div className="flex gap-16">

          

          {/* ── Products Grid ── */}
          <main className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <p className="text-sm text-text-muted">
                <span className="text-gold font-bold">{filtered.length}</span> منتج
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-text-muted font-light">
                  {showFavoritesOnly 
                    ? 'لا توجد منتجات في المفضلة بعد' 
                    : 'لا توجد منتجات في هذا القسم حتى الآن'}
                </p>
                {showFavoritesOnly ? (
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className="inline-block mt-6 text-gold text-sm hover:text-gold-light transition-colors"
                  >
                    عرض جميع المنتجات ←
                  </button>
                ) : (
                  <Link href="/products" className="inline-block mt-6 text-gold text-sm hover:text-gold-light transition-colors">
                    عرض جميع المنتجات ←
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} />
                ))}
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
