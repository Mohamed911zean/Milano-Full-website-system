'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function BranchesCTA() {
  return (
    <section className="section bg-bg-base relative overflow-hidden" dir="rtl">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative flex flex-col md:flex-row items-center gap-10 md:gap-0
                     px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20
                     rounded-2xl sm:rounded-3xl
                     border border-gold-border/15 bg-bg-card/40 backdrop-blur-xl
                     overflow-hidden"
        >
          {/* Ambient glow — decorative only */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

          {/* RIGHT (بالعربي اليمين هو البداية): الرقم الكبير وعدد الفروع */}
          <div className="relative flex-none flex flex-col items-center md:items-start
                          md:w-1/3 md:border-l md:border-gold-border/10 md:pl-12">
            <span
              className="font-bold text-transparent bg-clip-text bg-gradient-gold
                         font-display leading-none block"
              style={{ fontSize: 'clamp(5rem, 20vw, 9rem)' }}
            >
              5
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gold/60 mt-1">
              فروعنا في مصر
            </span>
          </div>

          {/* LEFT: النصوص وزر طلب التوجيه الفروع */}
          <div className="relative flex-1 flex flex-col items-center md:items-start
                          text-center md:text-right md:pr-12 gap-4">

            {/* شارات المدن المعربة والمقلوبة لتناسب الـ Flex اليميني */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
              {['المنصورة', 'شربين' , 'بلقاس' , 'طلخا'].map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                             border border-gold-border/20 text-[10px] font-bold
                             tracking-wide text-gold/70"
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  {city}
                </span>
              ))}
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-text-primary font-bold leading-tight">
              ميلانو في جميع أنحاء الدقهليه
            </h3>

            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              نقرب لك السعادة والمذاق الفاخر أينما كنت، تفضل بزيارة أقرب فروعنا إليك اليوم.
            </p>

            <Link href="/branches" className="mt-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-h-[44px] px-10
                           hover:shadow-gold transition-all duration-500"
              >
                ابحث عن فرع
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}