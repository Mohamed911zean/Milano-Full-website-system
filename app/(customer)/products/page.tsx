'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, SlidersHorizontal, X, ChevronDown, ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const CATEGORIES = [
  { id: 'all', name: 'الكل' },
  { id: 'cakes', name: 'كيك' },
  { id: 'pastries', name: 'مخبوزات' },
  { id: 'ice-cream', name: 'آيس كريم' },
  { id: 'chocolates', name: 'شوكولاتة' },
  { id: 'seasonal', name: 'موسمي' },
  { id: 'heat-eat', name: 'سخن وكل' },
  { id: 'special-cakes', name: 'كيكات خاصة' }
];

const PRODUCTS = [
  { id: 1, name: 'كيكة اللوتس', category: 'كيك', price: 450, image: '/cake/lotus.jpg', isNew: true },
  { id: 2, name: 'كيكة المانجو', category: 'كيك', price: 480, image: '/cake/mango.jpg' },
  { id: 3, name: 'كيكة النوتيلا', category: 'كيك', price: 500, image: '/cake/nutella.jpg' },
  { id: 4, name: 'فادج الفراولة', category: 'مخبوزات', price: 350, image: '/cake/strawberry-vadge.jpg' },
  { id: 5, name: 'كيكة التوت البري', category: 'كيك', price: 460, image: '/cake/forest.jpg' },
  { id: 6, name: 'شوكولاتة رويال', category: 'شوكولاتة', price: 550, image: '/cake/royal-cake.png', isNew: true },
  { id: 7, name: 'فطير بالعسل', category: 'مخبوزات', price: 280, image: '/soggy/honey-soggy.jpg' },
  { id: 8, name: 'فطير بالنوتيلا', category: 'مخبوزات', price: 300, image: '/soggy/nutell-soggy.jpg' },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [priceRange, setPriceRange] = useState(1000);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  const { addItem } = useCart();

  const filteredProducts = PRODUCTS.filter(p =>
    (activeCategory === 'الكل' || p.category === activeCategory) &&
    p.price <= priceRange &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: typeof PRODUCTS[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (addedMap[product.id]) return;
    
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <>
      <div className="bg-bg-base relative overflow-hidden" dir="rtl">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

        {/* ── PAGE HEADER ── */}
        <div className="relative h-[340px] sm:h-[450px] flex items-center justify-center overflow-hidden">
          <Image src="/hero-section.png" alt="Shop Banner" fill className="object-cover opacity-20 scale-110" priority sizes="100vw" quality={90} />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-base/40 via-bg-base/80 to-bg-base" />
          <div className="container relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <nav className="text-[10px] uppercase tracking-[0.2em] text-gold mb-5 font-medium">
                الرئيسية <span className="mx-3 opacity-30 text-text-primary">/</span> المتجر
              </nav>
              <h1 className="text-h1 text-text-primary font-display mb-4 text-3xl sm:text-5xl">
                التشكيلة <span className="text-gold">الكاملة</span>
              </h1>
              <div className="w-24 h-[1px] bg-gold/30 mx-auto mt-6" />
            </motion.div>
          </div>
        </div>

        {/* ── MOBILE: Category Scroll Strip ── */}
        <div className="lg:hidden sticky top-0 z-30 bg-bg-base/95 backdrop-blur-md border-b border-gold-border/10 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={cn(
                  "flex-none text-[12px] px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap",
                  activeCategory === cat.name
                    ? "bg-gold text-text-on-gold border-gold shadow-[0_0_16px_rgba(212,169,79,0.3)]"
                    : "bg-transparent text-text-secondary border-gold-border/20 hover:border-gold/40 hover:text-gold"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── MOBILE: Search + Filter Bar ── */}
        <div className="lg:hidden px-4 pt-4 pb-2 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث عن ابداعك المفضل..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-xl px-5 py-3 pl-10 text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-all duration-300 placeholder:text-text-fade"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-card/50 border border-gold-border/20 text-text-secondary hover:border-gold/40 hover:text-gold transition-all duration-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[11px] tracking-wider">تصفية</span>
          </button>
        </div>

        {/* ── MOBILE: Filter Drawer ── */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-bg-base border-l border-gold-border/15 p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[14px] text-gold font-black">خيارات التصفية</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="w-9 h-9 rounded-full border border-gold-border/20 flex items-center justify-center text-text-muted hover:border-gold hover:text-gold transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center">
                  <h4 className="text-[12px] text-gold font-black">السعر</h4>
                  <span className="text-sm font-display text-gold">{priceRange} جنيه</span>
                </div>
                <input
                  type="range" min="100" max="1000" step="50" value={priceRange}
                  onChange={e => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-gold bg-gold-border/10 h-[2px] rounded-full appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => { setActiveCategory('الكل'); setPriceRange(1000); setSearchQuery(''); setMobileFiltersOpen(false); }}
                className="w-full py-4 text-[11px] text-text-muted border border-gold-border/10 rounded-xl hover:bg-gold/5 hover:border-gold-border/30 hover:text-gold transition-all duration-500"
              >
                إعادة ضبط الفلاتر
              </button>
            </motion.div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="container pb-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden lg:block w-72 flex-none space-y-12">
              {/* Search */}
              <div className="space-y-6">
                <h4 className="text-[12px] text-gold font-black">البحث</h4>
                <div className="relative group">
                  <input
                    type="text" placeholder="ابحث عن اختيارك المفضل..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-xl px-6 py-4 pl-12 text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-all duration-500 placeholder:text-text-fade group-hover:border-gold-border/40"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-gold transition-colors duration-500" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <h4 className="text-[12px] text-gold font-black">الأقسام</h4>
                <ul className="space-y-4">
                  {CATEGORIES.map(cat => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveCategory(cat.name)}
                        className={cn(
                          "text-sm transition-all duration-500 flex items-center gap-3 group",
                          activeCategory === cat.name ? "text-gold -translate-x-2" : "text-text-secondary hover:text-gold hover:-translate-x-1"
                        )}
                      >
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-500",
                          activeCategory === cat.name
                            ? "bg-gold scale-100 shadow-[0_0_8px_rgba(212,169,79,0.6)]"
                            : "bg-gold-border/20 scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                        )} />
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[12px] text-gold font-black">نطاق السعر</h4>
                  <span className="text-sm font-display text-gold">{priceRange} جنيه</span>
                </div>
                <div className="px-2">
                  <input
                    type="range" min="100" max="1000" step="50" value={priceRange}
                    onChange={e => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-gold bg-gold-border/10 h-[2px] rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => { setActiveCategory('الكل'); setPriceRange(1000); setSearchQuery(''); }}
                className="w-full py-4 text-[11px] text-text-muted border border-gold-border/10 rounded-xl hover:bg-gold/5 hover:border-gold-border/30 hover:text-gold transition-all duration-500"
              >
                إعادة تعيين الخيارات
              </button>
            </aside>

            {/* ── PRODUCT GRID ── */}
            <main className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gold-border/10">
                <p className="text-sm text-text-secondary">
                  هناك <span className="text-gold font-bold">{filteredProducts.length}</span> منتج تم إعداده يدويًا بحب
                </p>
                <div className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-lg hover:bg-gold/5 transition-all duration-500">
                  <span className="text-[11px] text-text-muted group-hover:text-gold transition-colors">الترتيب: الأحدث</span>
                  <ChevronDown className="w-4 h-4 text-text-fade group-hover:text-gold transition-colors" />
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.6 }}
                      className="group"
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="bg-bg-card border border-gold-border/10 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-700 hover:border-gold-border/40 hover:shadow-hover hover:-translate-y-1 sm:hover:-translate-y-2">

                          {/* Image */}
                          <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-110"
                              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                              quality={85}
                            />

                            {/* Category badge */}
                            <div className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5">
                              <span className="bg-bg-base/70 backdrop-blur-md text-gold text-[9px] sm:text-[10px] font-black px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gold-border/20">
                                {product.category}
                              </span>
                            </div>

                            {/* New badge */}
                            {product.isNew && (
                              <div className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5">
                                <div className="bg-gold text-text-on-gold text-[9px] sm:text-[10px] font-black px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-[0.1em] animate-pulse">
                                  جديد
                                </div>
                              </div>
                            )}

                            {/* Wishlist button */}
                            <button
                              onClick={e => toggleWishlist(product.id, e)}
                              className={cn(
                                "absolute bottom-2.5 left-2.5 sm:bottom-auto sm:top-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 border",
                                wishlist.includes(product.id)
                                  ? "bg-gold border-gold text-text-on-gold"
                                  : "bg-bg-card/70 border-gold-border/20 text-text-muted sm:opacity-0 sm:group-hover:opacity-100 hover:border-gold hover:text-gold"
                              )}
                            >
                              <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all", wishlist.includes(product.id) && "fill-current")} />
                            </button>

                            {/* Desktop hover overlay with CTA */}
                            <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="hidden sm:flex absolute bottom-6 left-0 w-full px-5 gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <button
                                onClick={(e) => handleQuickAdd(e, product)}
                                className={cn(
                                  'flex-1 h-10 rounded-xl text-[11px] font-black tracking-wide',
                                  'flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95',
                                  addedMap[product.id]
                                    ? 'bg-emerald-600/80 text-white'
                                    : 'bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold shadow-[0_4px_16px_rgba(212,169,79,0.35)]'
                                )}
                              >
                                <AnimatePresence mode="wait">
                                  {addedMap[product.id] ? (
                                    <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                                      <Check className="w-3.5 h-3.5" /> تم أضافته!
                                    </motion.span>
                                  ) : (
                                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                                      <ShoppingBag className="w-3.5 h-3.5" /> أضف للسلة
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>
                            </div>
                          </div>

                          {/* Card Info */}
                          <div className="p-3 sm:p-6">
                            <h3 className="text-sm sm:text-xl font-display text-text-primary mb-0.5 sm:mb-2 group-hover:text-gold transition-colors duration-300 leading-tight line-clamp-1">
                              {product.name}
                            </h3>

                            <p className="hidden sm:block text-xs text-text-muted mb-5 tracking-wide line-clamp-1">
                              صُنع يدويًا بكل حب وبأجود المكونات الطبيعية الطازجة.
                            </p>

                            <div className="flex items-center justify-between mt-1 sm:mt-0">
                              <span className="text-sm sm:text-lg font-display text-gold tracking-wide">
                                {product.price} <span className="text-[10px] sm:text-xs text-gold/70">جنيه</span>
                              </span>

                              {/* Mobile: tap to add button */}
                              <button
                                onClick={(e) => handleQuickAdd(e, product)}
                                aria-label={`أضف ${product.name} للسلة`}
                                className={cn(
                                  'sm:hidden flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 active:scale-90',
                                  addedMap[product.id]
                                    ? 'bg-emerald-600/70 border-emerald-500/30 text-white'
                                    : 'bg-gold/10 border-gold/20 text-gold hover:bg-gold hover:text-text-on-gold'
                                )}
                              >
                                <AnimatePresence mode="wait">
                                  {addedMap[product.id] ? (
                                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                      <Check className="w-3.5 h-3.5" />
                                    </motion.span>
                                  ) : (
                                    <motion.span key="bag" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                      <ShoppingBag className="w-3.5 h-3.5" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>

                              {/* Desktop: add indicator */}
                              <div className="hidden sm:flex w-10 h-10 rounded-full border border-gold-border/10 items-center justify-center text-text-muted group-hover:border-gold group-hover:text-gold transition-all duration-500">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-24 sm:py-32 text-center bg-bg-card/30 rounded-2xl sm:rounded-3xl border border-dashed border-gold-border/20">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gold/20 mx-auto mb-5" />
                  <h3 className="text-lg sm:text-xl font-display text-text-primary mb-2">لم نجد أي نتائج</h3>
                  <p className="text-sm text-text-muted tracking-wide">جرّب تغيير فلاتر البحث أو تعديل السعر.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}