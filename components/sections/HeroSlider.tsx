'use client';

import React, { useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/Button';

import 'swiper/css';
import 'swiper/css/effect-fade';

const SLIDES = [
  {
    image: '/bakery.jpg',

    labelAr: 'تجربة مخبوزات استثنائية',

    titleAr:
      'رائحة الزبدة الطازجة\nالتي تجعل صباحك أجمل',

    descriptionAr:
      'كرواسون هش، مخبوزات يومية، ووصفات تُحضّر بعناية لتمنحك تجربة لا تُنسى مع كل قطعة.',

    ctaAr: 'اكتشف المخبوزات',

    secondaryCtaAr: 'الأكثر طلباً',

    href: '/products',

    secondaryHref: '/products',
  },

  {
    image: '/special-gateau.jpg',

    labelAr: 'صناعة تُتقن التفاصيل',

    titleAr:
      'جاتوهات فاخرة\nتليق بلحظاتك المهمة',

    descriptionAr:
      'تصميمات راقية ومذاق متوازن يجعل كل مناسبة تبدو أكثر أناقة وفخامة.',

    ctaAr: 'اطلب مناسبتك',

    secondaryCtaAr: 'شاهد التصاميم',

    href: '/special-cakes',

    secondaryHref: '/special-cakes',
  },

  {
    image: '/cakes-category.jpg',

    labelAr: 'توقيع ميلانو الخاص',

    titleAr:
      'الطعم الذي\nيبقى في الذاكرة',

    descriptionAr:
      'كيكات وحلويات مصنوعة بعناية لتمنحك تجربة غنية بالمذاق والجمال في كل تفصيلة.',

    ctaAr: 'تسوق الآن',

    secondaryCtaAr: 'الكيكات الخاصة',

    href: '/products',

    secondaryHref: '/special-cakes',
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<any>(null);

  const slide = SLIDES[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '100svh',
        minHeight: '620px',
      }}
    >
      {/* Swiper */}
      <Swiper
        onSwiper={(s: any) => (swiperRef.current = s)}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1800}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="absolute inset-0 h-full w-full"
      >
        {SLIDES.map((s, index) => (
          <SwiperSlide key={index}>
            {({ isActive }: any) => (
              <div className="relative h-full w-full overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: isActive
                      ? 'scale(1.06)'
                      : 'scale(1)',

                    transition:
                      'transform 7s cubic-bezier(0.22,1,0.36,1)',
                  }}
                >
                  <Image
                    src={s.image}
                    alt={s.titleAr}
                    fill
                    priority={index === 0}
                    loading={
                      index === 0
                        ? 'eager'
                        : 'lazy'
                    }
                    quality={92}
                    sizes="100vw"
                    className="object-cover"
                    style={{
                      objectPosition: 'center 30%',
                    }}
                  />
                </div>

                {/* Cinematic Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.12),transparent_35%)]" />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-center md:justify-end"
        style={{
          paddingBottom:
            'max(env(safe-area-inset-bottom),0px)',
        }}
      >
        <div className="container relative w-full pb-24 md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-5xl"
            >
              {/* Label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.5,
                }}
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-md
                  px-4
                  py-2
                  mb-6
                "
              >
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />

                <span
                  className="
                    text-[10px]
                    sm:text-[11px]
                    font-semibold
                    tracking-[0.28em]
                    uppercase
                    text-gold-light
                  "
                >
                  {slide.labelAr}
                </span>
              </motion.div>

              {/* Divider */}
              <div className="mb-6 divider-gold max-w-[120px]" />

              {/* Title */}
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.22,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  text-white
                  font-display
                  font-light
                  leading-[0.95]
                  tracking-[-0.04em]
                  whitespace-pre-line
                  mb-7
                  max-w-5xl
                  drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                "
                style={{
                  fontSize:
                    'clamp(3rem, 9vw, 6.8rem)',
                }}
              >
                {slide.titleAr}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.55,
                }}
                className="
                  max-w-2xl
                  text-[14px]
                  sm:text-[15px]
                  md:text-[17px]
                  leading-[2]
                  text-white/72
                  font-light
                  mb-10
                "
              >
                {slide.descriptionAr}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.38,
                  duration: 0.55,
                }}
                className="
                  pointer-events-auto
                  flex
                  flex-col
                  sm:flex-row
                  items-stretch
                  sm:items-center
                  gap-4
                "
              >
                {/* Primary Button */}
                <Link
                  href={slide.href}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="gold"
                    size="lg"
                    className="
                      w-full sm:w-auto
                      min-h-[54px]
                      px-8
                      text-sm
                      font-semibold
                      rounded-full
                      shadow-gold
                      hover:scale-[1.02]
                      transition-all
                      duration-500
                    "
                  >
                    {slide.ctaAr}
                  </Button>
                </Link>

                {/* Secondary Button */}
                <Link
                  href={slide.secondaryHref}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="
                      w-full sm:w-auto
                      min-h-[54px]
                      px-8
                      text-sm
                      rounded-full
                      border-white/15
                      bg-white/[0.03]
                      backdrop-blur-md
                      text-white
                      hover:bg-white/10
                      hover:border-white/30
                      transition-all
                      duration-500
                    "
                  >
                    {slide.secondaryCtaAr}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Indicators */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-20
          flex
          items-end
          justify-center
          md:justify-between
          px-5
          sm:px-8
          md:px-12
        "
        style={{
          paddingBottom:
            'max(calc(env(safe-area-inset-bottom) + 18px),18px)',
        }}
      >
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() =>
                swiperRef.current?.slideToLoop(i)
              }
              aria-label={`Slide ${i + 1}`}
              className="flex items-center py-3"
            >
              <span
                className="
                  block
                  rounded-full
                  transition-all
                  duration-500
                  ease-out
                "
                style={{
                  width:
                    activeIndex === i
                      ? '30px'
                      : '5px',

                  height: '5px',

                  background:
                    activeIndex === i
                      ? 'rgba(201,168,76,1)'
                      : 'rgba(255,255,255,0.28)',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

