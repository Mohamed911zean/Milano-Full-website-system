'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, type Transition } from 'framer-motion';
import type { Category } from '@/lib/supabase/types';

const ease: Transition['ease'] = [0.22, 1, 0.36, 1];

// الصور الـ fallback لكل قسم (لحد ما تضيف صور حقيقية في الـ DB)
const CATEGORY_FALLBACKS: Record<string, string> = {
  'تورت': '/cakes-category.jpg',
  'جاتوه': '/special-gateau.jpg',
  'حلويات شرقية': '/oriental-category.jpg',
  'مخبوزات': '/bakery.jpg',
  'كافيهات': '/eclair.jpg',
  'شوكليت': '/chocolate-category.jpg',
  'منيو العيد': '/kahk.jpg',
  'منيو المناسبات': '/ready-assortments.jpg',
};

interface Props {
  categories: Category[];
}

export function CategoriesSection({ categories }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="container mx-auto px-6 md:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="flex items-end justify-between mb-14"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-gold block mb-3">Collections</span>
          <h2 className="font-display font-light text-white leading-none" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            الأقسام
          </h2>
        </div>
        <Link href="/products"
          className="group flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-sm font-medium pb-1 border-b border-transparent hover:border-gold">
          عرض الكل
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-180 group-hover:translate-x-[-3px] transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        {categories.slice(0, 6).map((cat, i) => {
          const image = cat.image_url ?? CATEGORY_FALLBACKS[cat.name_ar] ?? '/bakery.jpg';

          // Layout patterns
          const gridClass = i === 0
            ? 'col-span-12 sm:col-span-8 aspect-[16/8] sm:aspect-[2/1]'
            : i === 1
            ? 'col-span-12 sm:col-span-4 aspect-[16/8] sm:aspect-[1/1]'
            : 'col-span-6 sm:col-span-4 aspect-square';

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.08 }}
              className={gridClass}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group relative block h-full overflow-hidden rounded-2xl border border-white/5 hover:border-gold/25 transition-all duration-700"
              >
                <Image
                  src={image}
                  alt={cat.name_ar}
                  fill
                  className="object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-700" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-gold block mb-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                    {cat.name_en ?? 'Collection'}
                  </span>
                  <h3 className={cn(
                    'font-display font-light text-white group-hover:text-gold transition-colors duration-500',
                    i === 0 ? 'text-3xl sm:text-4xl' : i === 1 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                  )}>
                    {cat.name_ar}
                  </h3>
                </div>

                {/* Arrow */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-1 group-hover:translate-y-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Show remaining categories as pills */}
      {categories.length > 6 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
          className="flex flex-wrap gap-3 mt-6"
        >
          {categories.slice(6).map(cat => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="px-5 py-2.5 rounded-full border border-gold-border/20 text-text-muted text-sm font-medium hover:border-gold/40 hover:text-gold transition-all duration-300"
            >
              {cat.name_ar}
            </Link>
          ))}
        </motion.div>
      )}
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
