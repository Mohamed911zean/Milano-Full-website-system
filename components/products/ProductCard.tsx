'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import WishlistButton from '@/components/products/WishlistButton';
import type { ProductWithVariants } from '@/lib/supabase/types';

export default function ProductCard({ product }: { product: ProductWithVariants }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const defaultVariant = product.variants?.find(v => v.is_default) ?? product.variants?.[0];
  const price = Number(defaultVariant?.price ?? product.base_price);
  const image = product.images?.[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name_ar, price, image: image ?? '' });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

            <WishlistButton product={product} />

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
                onClick={handleAdd}
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
              <button
                onClick={handleAdd}
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
}
