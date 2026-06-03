'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Trophy, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'حرفية عالية',
  },
  {
    icon: Leaf,
    title: 'مكونات فاخرة',
  },
  {
    icon: Trophy,
    title: 'موثوق لأكثر من 14 عاماً',
  },
  {
    icon: Users,
    title: 'تجربة شخصية مميزة',
  },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-bg-deep relative overflow-hidden" dir="rtl">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold mb-4 block">
              عِش تجربة وفن الحلويات الفاخرة
            </span>
            <h2 className="text-h2 text-text-primary">
              لماذا تختار ميلانو ؟
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-bg-card border border-gold-border/20 flex items-center justify-center mb-8 text-gold shadow-premium transition-all duration-500 group-hover:bg-gradient-gold group-hover:text-text-on-gold group-hover:shadow-gold group-hover:-translate-y-2 relative">
                {/* Subtle Inner Ring */}
                <div className="absolute inset-2 rounded-full border border-gold/10 group-hover:border-text-on-gold/20" />
                <feature.icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] leading-relaxed group-hover:text-text-primary transition-colors duration-300">
                {feature.title}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}