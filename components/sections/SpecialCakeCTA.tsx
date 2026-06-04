'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion, type Transition } from 'framer-motion';

const ease: Transition['ease'] = [0.22, 1, 0.36, 1];

export function SpecialCakeCTA() {
  const dynamicDate = new Date();
  dynamicDate.setDate(dynamicDate.getDate() + 2);
  
  // تنسيق التاريخ باللغة العربية
  const formattedDate = dynamicDate.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="py-16 lg:py-28 bg-bg-deep relative overflow-hidden border-y border-gold/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" dir="rtl">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full lg:w-1/3 h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        {/* flex-col-reverse puts the image ON TOP for mobile/tablet */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Content */}
          <div className="flex-1 w-full text-center lg:text-right">
            <motion.div
              initial={{ opacity: 0, y: 30, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1, ease }}
              viewport={{ once: true }}
              className="flex flex-col items-center lg:items-start"
            >
              <span className="text-script text-gold text-3xl lg:text-5xl mb-4 block drop-shadow-sm">
                اطلب كيكتك المخصصة الآن
              </span>
              
              {/* Responsive Text: Smaller on mobile, large on desktop */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-text-primary mb-6 leading-tight font-bold max-w-lg lg:max-w-full">
                اجعل احتفالك ذكرى لا تُنسى
              </h2>
              
              <p className="text-sm md:text-base text-text-secondary mb-10 max-w-md lg:max-w-xl font-light leading-relaxed">
                سواء كان حفل زفاف، عيد ميلاد، أو مناسبة خاصة، نحن نصمم ونصنع كيكة أحلامك الفاخرة لتناسب ذوقك الرفيع بكل تفاصيلها.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:justify-start sm:justify-center">
                <Link href="/special-cakes" className="w-full sm:w-auto">
                  <Button variant="gold" size="lg" className="shadow-[0_10px_20px_-10px_rgba(212,169,79,0.5)] hover:scale-105 transition-transform w-full sm:w-auto">
                    ابدأ الاستشارة الآن
                  </Button>
                </Link>
                
                <div className="flex flex-col items-center sm:items-start">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-fade font-bold mb-1">
                    أقرب موعد متاح للتوصيل
                  </p>
                  <p className="text-xs lg:text-sm text-gold font-medium tracking-wide bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full relative flex justify-center py-10 lg:py-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[450px] aspect-square"
            >
              {/* --- Premium Animated Border Enhancements --- */}
              {/* Outer Spinning Dashed Gold Border */}
              <div className="absolute inset-0 rounded-full border-[2px] border-gold/30 border-dashed animate-[spin_20s_linear_infinite]" />
              
              {/* Inner Glowing Ring */}
              <div className="absolute inset-4 rounded-full border border-gold/10 bg-gradient-to-tr from-gold/10 to-transparent backdrop-blur-md shadow-inner" />
              
              {/* Soft Center Glow behind the cake */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold/20 blur-[60px] rounded-full" />

              {/* The Cake Image */}
              <motion.div
                animate={{ translateY: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-full h-full"
              >
                <Image
                  src="/eight-season-cake-removebg.png"
                  alt="كيكة ميلانو الملكية الخاصة"
                  fill
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] scale-110"
                />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
