'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import 'swiper/css';
import 'swiper/css/effect-fade';

const ease = [0.22, 1, 0.36, 1];

const SLIDES = [
  {
    image: '/bakery.jpg',
    labelAr: 'تجربة مخبوزات استثنائية',
    titleLine1: 'رائحة الزبدة الطازجة',
    titleLine2: 'التي تجعل صباحك أجمل',
    descriptionAr: 'كرواسون هش، مخبوزات يومية، ووصفات تُحضّر بعناية لتمنحك تجربة لا تُنسى مع كل قطعة.',
    ctaAr: 'اكتشف المخبوزات',
    secondaryCtaAr: 'الأكثر طلباً',
    href: '/products',
    secondaryHref: '/products',
    accent: 'from-amber-900/30',
  },
  {
    image: '/special-gateau.jpg',
    labelAr: 'صناعة تُتقن التفاصيل',
    titleLine1: 'جاتوهات فاخرة',
    titleLine2: 'تليق بلحظاتك المهمة',
    descriptionAr: 'تصميمات راقية ومذاق متوازن يجعل كل مناسبة تبدو أكثر أناقة وفخامة.',
    ctaAr: 'اطلب مناسبتك',
    secondaryCtaAr: 'شاهد التصاميم',
    href: '/specialCake',
    secondaryHref: '/specialCake',
    accent: 'from-rose-900/20',
  },
  {
    image: '/cakes-category.jpg',
    labelAr: 'توقيع ميلانو الخاص',
    titleLine1: 'الطعم الذي',
    titleLine2: 'يبقى في الذاكرة',
    descriptionAr: 'كيكات وحلويات مصنوعة بعناية لتمنحك تجربة غنية بالمذاق والجمال في كل تفصيلة.',
    ctaAr: 'تسوق الآن',
    secondaryCtaAr: 'الكيكات الخاصة',
    href: '/products',
    secondaryHref: '/specialCake',
    accent: 'from-stone-900/30',
  },
];

// ─── Magnetic Button ──────────────────────────────────────
function MagneticLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      <Link href={href}>{children}</Link>
    </motion.div>
  );
}

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const swiperRef = useRef<any>(null);

  const slide = SLIDES[activeIndex];

  const handleSlideChange = useCallback((s: any) => {
    setPrevIndex(activeIndex);
    setActiveIndex(s.realIndex);
  }, [activeIndex]);

  // Word-by-word reveal
  const words1 = slide.titleLine1.split(' ');
  const words2 = slide.titleLine2.split(' ');

  return (
    <section className="relative w-full overflow-hidden " style={{ height: '100svh', minHeight: '620px' }}>

      {/* ── Swiper BG ── */}
      <Swiper
        onSwiper={(s: any) => (swiperRef.current = s)}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2000}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        onSlideChange={handleSlideChange}
        className="absolute inset-0 h-full w-full"
      >
        {SLIDES.map((s, index) => (
          <SwiperSlide key={index}>
            {({ isActive }: any) => (
              <div className="relative h-full w-full overflow-hidden">
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: isActive ? 'scale(1.07)' : 'scale(1)',
                    transition: 'transform 8s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <Image
                    src={s.image}
                    alt={s.titleLine1}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    quality={92}
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>

                {/* Cinematic overlays */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                {/* Accent color per slide */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${s.accent} to-transparent`} />
                {/* Grain */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Content ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="container relative w-full pb-28 md:pb-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl"
            >
              {/* Eyebrow label */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.1 }}
                className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.35em] uppercase text-gold-light">
                  {slide.labelAr}
                </span>
              </motion.div>

              {/* Slide counter */}
              <div className="absolute top-0 left-0 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-white/10 leading-none">
                  0{activeIndex + 1}
                </span>
                <span className="text-white/20 text-sm">/0{SLIDES.length}</span>
              </div>

              {/* Gold line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease, delay: 0.2 }}
                className="h-px w-24 bg-gradient-to-r from-gold to-transparent mb-6 origin-right"
              />

              {/* Title — word by word */}
              <h1
                className="font-fustat  leading-[0.92] tracking-[-0.04em] text-white mb-7 overflow-hidden"
                style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}
              >
                <span className="block">
                  {words1.map((word, i) => (
                    <motion.span
                      key={`${activeIndex}-w1-${i}`}
                      className="inline-block mr-3"
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.09 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="block text-gold italic">
                  {words2.map((word, i) => (
                    <motion.span
                      key={`${activeIndex}-w2-${i}`}
                      className="inline-block mr-3"
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, ease, delay: 0.45 + i * 0.09 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.65 }}
                className="max-w-xl text-[14px] sm:text-[15px] md:text-[25px] leading-[2] text-white font-body font-light mb-10"
              >
                {slide.descriptionAr}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.75 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <MagneticLink href={slide.href} className="w-full sm:w-auto">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto min-h-[54px] px-10 rounded-full shadow-gold hover:scale-[1.03] transition-all duration-500"
                  >
                    {slide.ctaAr}
                  </Button>
                </MagneticLink>

                <MagneticLink href={slide.secondaryHref} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto min-h-[54px] px-10 rounded-full border-white/15 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500"
                  >
                    {slide.secondaryCtaAr}
                  </Button>
                </MagneticLink>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Indicators ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 container pb-8 flex items-center justify-between">
        {/* Pill indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={`Slide ${i + 1}`}
              className="group flex items-center py-2"
            >
              <motion.span
                animate={{
                  width: activeIndex === i ? 32 : 5,
                  background: activeIndex === i ? 'rgba(201,168,76,1)' : 'rgba(255,255,255,0.25)',
                }}
                transition={{ duration: 0.4, ease }}
                className="block rounded-full h-[5px]"
              />
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-32 h-px bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              key={activeIndex}
              className="absolute inset-y-0 left-0 bg-gold rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold">
            {String(activeIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 right-8 z-20 hidden lg:flex flex-col items-center gap-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/25 font-bold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}