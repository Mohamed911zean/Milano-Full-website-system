'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const STATS = [
  {
    image: '/oriental-category.jpg',
    value: 14,
    suffix: '+',
    label: 'عاماً من الجودة الفاخرة في ميلانو',
  },
  {
    image: '/ready-assortments.jpg',
    value: 5,
    suffix: '',
    label: 'فرع في جميع أنحاء الدقهليه والمنصوره',
  },
  {
    image: '/bakery-category.jpg',
    value: 100,
    suffix: '%',
    label: 'مخبز محلي — مصنوع بحب',
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-stat text-gold">
      {count.toLocaleString('ar-EG')}{suffix}
    </span>
  );
}

export function LegacyStats() {
  return (
    <section className="section bg-bg-base relative overflow-hidden" dir="rtl">
      {/* Background Image with Premium Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/why-choose-us.jpg"
          alt="Legacy background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-transparent to-bg-base" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold mb-4 block">
              نصنع الحلويات بشغف
            </span>
            <h2 className="text-h2 text-text-primary">
              مسيرة من التميز الرائع
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative w-full aspect-[4/5] mb-8 rounded-2xl overflow-hidden border border-gold-border/10 shadow-premium transition-all duration-700 group-hover:border-gold-border/40 group-hover:-translate-y-2">
                <Image
                  src={stat.image}
                  alt={stat.label}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent" />
              </div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mt-4 max-w-[200px] leading-relaxed group-hover:text-gold transition-colors duration-300">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}