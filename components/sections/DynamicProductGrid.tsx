'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

function SkeletonCard() {
  return (
    <div className="bg-bg-card/50 border border-gold-border/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-white/5" />
      <div className="p-7 space-y-4">
        <div className="h-6 bg-white/5 rounded w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-white/5 rounded w-1/4" />
          <div className="h-10 bg-white/5 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}

const ALL_PRODUCTS = [
  { id: 1, name: 'Lotus Cake', price: 450, image: '/cake/lotus.jpg' },
  { id: 2, name: 'Mango Cake', price: 480, image: '/cake/mango.jpg' },
  { id: 3, name: 'Nutella Cake', price: 500, image: '/cake/nutella.jpg' },
  { id: 4, name: 'Strawberry Vadge', price: 350, image: '/cake/strawberry-vadge.jpg' },
  { id: 5, name: 'Four Season', price: 550, image: '/cake/four-season.jpg' },
  { id: 6, name: 'Heart Cake', price: 420, image: '/cake/heart-cake.jpg' },
  { id: 7, name: 'Oreo Cake', price: 460, image: '/cake/oreo-cake.jpg' },
  { id: 8, name: 'Honey Soggy', price: 280, image: '/soggy/honey-soggy.jpg' },
];

export function DynamicProductGrid() {
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const products = useMemo(() => ALL_PRODUCTS, []);

  const handleAdd = (product: typeof ALL_PRODUCTS[0]) => {
    if (addedMap[product.id]) return;
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <section className="section bg-bg-base relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold mb-4 block">Our Specialties</span>
            <h2 className="text-h2 text-text-primary font-display">Daily Masterpieces</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <a
              href="/shop"
              className="inline-flex items-center justify-center min-w-[180px] px-6 py-3 rounded-xl border border-gold-border/30 text-[11px] font-black uppercase tracking-[0.18em] text-text-secondary hover:border-gold hover:text-gold transition-all duration-400"
            >
              View Full Catalog
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 min-h-[500px]">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            ) : (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-bg-card border border-gold-border/10 rounded-2xl overflow-hidden transition-all duration-700 hover:border-gold-border/40 hover:shadow-hover hover:-translate-y-2">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-7">
                      <h4 className="text-h4 text-text-primary mb-2 font-display group-hover:text-gold transition-colors duration-300">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-gold font-bold tracking-wider">{product.price} EGP</p>
                        <button
                          onClick={() => handleAdd(product)}
                          aria-label={`Add ${product.name} to cart`}
                          className={cn(
                            'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-400 active:scale-90',
                            addedMap[product.id]
                              ? 'border-emerald-500/40 bg-emerald-600/70 text-white'
                              : 'border-gold-border/10 text-text-muted group-hover:border-gold group-hover:text-gold'
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {addedMap[product.id] ? (
                              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check className="w-4 h-4" />
                              </motion.span>
                            ) : (
                              <motion.span key="bag" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <ShoppingBag className="w-4 h-4" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
