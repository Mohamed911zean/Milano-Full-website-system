'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, History, ShieldCheck } from 'lucide-react';
import { SectionLabel, GoldDivider } from '@/components/ui/Typography';

const features = [
  {
    icon: <History className="w-6 h-6" />,
    title: 'أصالة العراقة',
    desc: 'بدأت رحلة ميلانو بشغف حقيقي لتقديم حلويات تجمع بين الطعم الأصيل والشكل الراقي في كل مناسبة.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'جودة نلتزم بها',
    desc: 'نستخدم مكونات مختارة بعناية ونحافظ على ثبات الجودة في كل فرع وكل منتج يصل إلى عملائنا.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'صناعة بحب',
    desc: 'كل قطعة يتم إعدادها بعناية واهتمام بالتفاصيل لتناسب ذوق الأسرة المصرية والمناسبات الخاصة.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-base pt-32 pb-24 overflow-hidden">
      <section className="container mx-auto px-6 mb-32 relative">
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-gold/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <SectionLabel className="justify-center">قصة ميلانو</SectionLabel>
            <h1 className="text-hero font-display font-light text-white leading-tight">
              عندما يلتقي <span className="text-gold italic">الذوق</span> <br />
              بجودة الصنعة
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-text-secondary text-xl font-light leading-relaxed max-w-3xl mx-auto"
          >
            في ميلانو لا نقدم مجرد حلوى، بل نصنع تجربة كاملة من الجودة والاهتمام والمذاق الذي يظل في الذاكرة.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="aspect-[4/5] relative rounded-[40px] overflow-hidden shadow-premium">
              <Image src="/bakery.jpg" alt="Milano Bakery" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10 text-right">
            <div className="space-y-6">
              <h2 className="text-h2 font-display font-light text-white">رؤيتنا ورسالتنا</h2>
              <p className="text-text-secondary text-lg font-light leading-relaxed">
                نسعى لأن تكون ميلانو الوجهة الأولى للحلويات الفاخرة في المنصورة والمناطق المحيطة، من خلال جودة ثابتة وخدمة راقية وتنوع يناسب جميع المناسبات.
              </p>
              <p className="text-text-secondary text-lg font-light leading-relaxed">
                رسالتنا أن نكون جزءاً من لحظاتكم السعيدة عبر منتجات موثوقة وطعم مميز وخبرة يومية في خدمة العملاء داخل الفروع وخارجها.
              </p>
            </div>

            <GoldDivider />

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="text-gold font-bold text-lg">فروعنا</h4>
                <p className="text-text-fade text-sm font-light">المنصورة، طلخا، بلقاس، شربين</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-gold font-bold text-lg">ساعات العمل</h4>
                <p className="text-text-fade text-sm font-light">يومياً 10 صباحاً حتى 12 مساءً</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-bg-deep py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <SectionLabel className="justify-center">لماذا ميلانو؟</SectionLabel>
            <h2 className="text-h2 font-display font-light text-white">سر التميز في كل قطعة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-10 rounded-3xl text-center space-y-6 hover-lift"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-text-muted text-sm font-light leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
