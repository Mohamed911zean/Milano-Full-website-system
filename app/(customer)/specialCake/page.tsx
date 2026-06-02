'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar, Wand2, Sparkles, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const OCCASIONS = [
  { id: 'Birthday', title: 'عيد ميلاد', image: '/cake/heart-cake.jpg', desc: 'احتفل بعام آخر جميل' },
  { id: 'Wedding', title: 'زفاف', image: '/cake/royal-cake.png', desc: 'تحفة فنية ليومك الخاص' },
  { id: 'Engagement', title: 'خطوبة', image: '/cake/vadge.jpg', desc: 'بداية الأبدية' },
  { id: 'Custom Character', title: 'شخصيات', image: '/cake/oreo-cake.jpg', desc: 'خيال ينبض بالحياة' },
];

const FLAVORS = [
  { id: 'Madagascar Vanilla', title: 'Vanilla ' },
  { id: 'Belgian Chocolate', title: 'Belgium Checkolate ' },
  { id: 'Red Velvet', title: 'Red Velvet' },
  { id: 'M & M', title: 'M & M' },
  { id: 'KitKat', title: 'KitKat' },
  { id: 'Lotus Biscoff', title: 'Lotus ' },
  { id: 'Rich Nutella', title: 'Rich Nutella' },
  { id: 'Wild Strawberry', title: 'Strawberry' }
];

const SIZES = [
  { id: 'Intimate (10 Pax)', title: 'مقربين (١٠ أشخاص)', desc: 'مثالية للتجمعات الصغيرة والمقربة' },
  { id: 'Gathering (20 Pax)', title: 'تجمع (٢٠ شخص)', desc: 'مثالية للعائلة والأصدقاء' },
  { id: 'Celebration (30 Pax)', title: 'احتفال (٣٠ شخص)', desc: 'قطعة مميزة للاحتفالات الكبيرة' },
  { id: 'Grand (50+ Pax)', title: 'ضخم (+٥٠ شخص)', desc: 'تصميم ملكي متعدد الطبقات للمناسبات الضخمة' }
];

export default function SpecialCakesPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    occasion: '',
    size: '',
    flavor: '',
    colorTheme: '',
    message: '',
    deliveryDate: '',
    phoneNumber: '',
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // التقديم التلقائي بعد الاختيار بنقرة واحدة
  const handleSelection = (field: string, value: string) => {
    updateForm(field, value);
    setTimeout(() => {
      nextStep();
    }, 400); // تأخير بسيط ليلاحظ المستخدم الاختيار
  };

  const handleSubmit = () => {
    toast.success('تم إرسال طلبك بنجاح!');
    router.push('/');
  };

  const variants: Variants = {
    initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -40, filter: 'blur(10px)', transition: { duration: 0.5, ease: 'easeIn' } }
  };

  return (
    <>
      <div className="bg-bg-base relative min-h-screen pt-24 pb-20 flex flex-col justify-center overflow-hidden" dir="rtl">
        {/* الخلفية والمؤثرات البصرية */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />
        </div>

        {/* مؤشر الخطوات */}
        {step > 0 && step < 5 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container relative z-20 mb-8 sm:mb-16 flex justify-center"
          >
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center">
                  <div 
                    className={cn(
                      "h-1.5 transition-all duration-700 rounded-full",
                      step === s ? "bg-gold w-12 shadow-[0_0_12px_rgba(212,169,79,0.5)]" : step > s ? "bg-gold/50 w-6" : "bg-gold-border/20 w-4"
                    )} 
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="container relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ── الخطوة 0: البداية ── */}
            {step === 0 && (
              <motion.div key="step0" variants={variants} initial="initial" animate="animate" exit="exit" className="text-center max-w-4xl mx-auto">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-full h-full bg-bg-card/50 backdrop-blur-xl border border-gold-border/20 rounded-full flex items-center justify-center">
                    <Wand2 className="w-12 h-12 text-gold" />
                  </div>
                </div>
                
                <span className="text-script text-gold text-4xl sm:text-6xl mb-4 sm:mb-6 block drop-shadow-lg">
                  تجربة مخصصة لك بالكامل
                </span>
                <h1 className="text-4xl sm:text-7xl text-text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em] font-display mb-8 leading-tight">
                  اصنع <span className="text-gold">تحفتك</span> الفنية
                </h1>
                <p className="text-text-secondary text-sm sm:text-base tracking-widest max-w-2xl mx-auto mb-12 leading-relaxed">
                  رحلة مخصصة لتصميم الكعكة المثالية التي تناسب ذوقك ومناسبتك الخاصة.
                </p>
                
                <Button variant="gold" className="h-16 px-12 text-[11px] uppercase tracking-[0.3em] font-black shadow-[0_0_40px_rgba(212,169,79,0.3)] group" onClick={nextStep}>
                  ابدأ الرحلة <Sparkles className="w-4 h-4 mr-3 transition-transform duration-500 group-hover:rotate-12" />
                </Button>
              </motion.div>
            )}

            {/* ── الخطوة 1: المناسبة ── */}
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-10 sm:mb-16">
                  <span className="text-[18px] font-black uppercase tracking-[0.4em] text-gold mb-4 block">
                    الخطوة الأولى
                  </span>
                  <h2 className="text-3xl sm:text-5xl text-text-primary uppercase tracking-[0.1em] font-display">
                    ما هي المناسبة التي نحتفل بها؟
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {OCCASIONS.map((occ, i) => (
                    <motion.div
                      key={occ.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      onClick={() => handleSelection('occasion', occ.title)}
                      className={cn(
                        "relative h-[200px] sm:h-[320px] group rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500",
                        formData.occasion === occ.title 
                          ? "border-gold shadow-[0_0_30px_rgba(212,169,79,0.4)] scale-[1.02]" 
                          : "border-gold-border/10 hover:border-gold/50 hover:shadow-card"
                      )}
                    >
                      <Image src={occ.image} alt={occ.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
                      <div className="absolute bottom-6 right-6 left-6 text-right">
                        <h3 className="text-xl sm:text-2xl font-display text-gold mb-2 transition-colors">{occ.title}</h3>
                        <p className="text-[15px] sm:text-xs tracking-wider transition-all duration-500">
                          {occ.desc}
                        </p>
                      </div>
                      
                      {formData.occasion === occ.title && (
                        <div className="absolute top-4 left-4 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-text-on-gold">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── الخطوة 2: الحجم ── */}
            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-10 sm:mb-16">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold mb-4 block">
                    الخطوة الثانية
                  </span>
                  <h2 className="text-3xl sm:text-5xl text-text-primary uppercase tracking-[0.1em] font-display">
                    ما هو حجم الاحتفال؟
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {SIZES.map((size, i) => (
                    <motion.button
                      key={size.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      onClick={() => handleSelection('size', size.title)}
                      className={cn(
                        "p-6 sm:p-8 rounded-3xl border text-right transition-all duration-500 relative overflow-hidden group",
                        formData.size === size.title 
                          ? "bg-gold border-gold text-text-on-gold shadow-[0_0_30px_rgba(212,169,79,0.3)] scale-[1.02]" 
                          : "bg-bg-card/40 backdrop-blur-xl border-gold-border/10 text-text-secondary hover:border-gold/50 hover:bg-gold/5"
                      )}
                    >
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <div className="text-right">
                          <h3 className={cn("text-lg sm:text-xl font-display mb-2", formData.size === size.title ? "text-text-on-gold" : "text-text-primary")}>
                            {size.title}
                          </h3>
                          <p className={cn("text-[10px] sm:text-xs tracking-wider", formData.size === size.title ? "text-text-on-gold/80" : "text-text-fade")}>
                            {size.desc}
                          </p>
                        </div>
                        <div className={cn(
                          "w-10 h-10 rounded-full border flex items-center justify-center transition-colors mr-auto",
                          formData.size === size.title ? "border-text-on-gold/30 bg-text-on-gold/10" : "border-gold-border/20 group-hover:border-gold/50"
                        )}>
                          {formData.size === size.title ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-gold/50 group-hover:bg-gold" />}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <button onClick={prevStep} className="text-[11px] uppercase tracking-[0.3em] font-black text-text-muted hover:text-gold transition-colors flex items-center group">
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> الرجوع للخلف
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── الخطوة 3: النكهة ── */}
            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-10 sm:mb-16">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold mb-4 block">
                    الخطوة الثالثة
                  </span>
                  <h2 className="text-3xl sm:text-5xl text-text-primary uppercase tracking-[0.1em] font-display">
                    اختر النكهة المفضلة
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {FLAVORS.map((flavor, i) => (
                    <motion.button
                      key={flavor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      onClick={() => handleSelection('flavor', flavor.title)}
                      className={cn(
                        "px-8 sm:px-10 py-5 sm:py-6 rounded-full border text-sm sm:text-base font-black tracking-widest transition-all duration-500",
                        formData.flavor === flavor.title 
                          ? "bg-gold border-gold text-text-on-gold shadow-[0_0_20px_rgba(212,169,79,0.4)] scale-105" 
                          : "bg-bg-card/40 backdrop-blur-xl border-gold-border/10 text-text-secondary hover:border-gold/50 hover:text-gold hover:bg-gold/5 hover:-translate-y-1"
                      )}
                    >
                      {flavor.title}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-16 flex justify-center">
                  <button onClick={prevStep} className="text-[11px] uppercase tracking-[0.3em] font-black text-text-muted hover:text-gold transition-colors flex items-center group">
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> الرجوع للخلف
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── الخطوة 4: التفاصيل الإضافية ── */}
            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-10 sm:mb-16">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold mb-4 block">
                    اللمسات الأخيرة
                  </span>
                  <h2 className="text-3xl sm:text-5xl text-text-primary uppercase tracking-[0.1em] font-display">
                    تفاصيل تحفتك الفنية
                  </h2>
                </div>

                <div className="bg-bg-card/30 backdrop-blur-2xl border border-gold-border/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-card text-right">
                  <div className="space-y-8">
                    {/* ثيم الألوان */}
                    <div className="space-y-4">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-gold font-black block">
                        التوجه البصري والألوان المطلوبة
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: ذهبي ملكي مع أزرق داكن وأبيض"
                        className="w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-2xl px-6 py-5 text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-all duration-500 placeholder:text-text-fade hover:border-gold-border/40 text-right"
                        onChange={(e) => updateForm('colorTheme', e.target.value)}
                        value={formData.colorTheme}
                      />
                    </div>

                    {/* رقم الهاتف */}
                    <div className="space-y-4">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-gold font-black flex items-center gap-2">
                        رقم الهاتف <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="أدخل رقم هاتفك للتواصل"
                        className="w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-2xl px-6 py-5 text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-all duration-500 placeholder:text-text-fade hover:border-gold-border/40 text-right"
                        onChange={(e) => updateForm('phoneNumber', e.target.value)}
                        value={formData.phoneNumber}
                        required
                      />
                      <p className="text-[10px] text-text-fade tracking-wider">
                        سيتواصل معك فريق المتجر لتأكيد التفاصيل النهائية.
                      </p>
                    </div>

                    {/* التاريخ */}
                    <div className="space-y-4">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-gold font-black block">
                        تاريخ المناسبة المطلوب
                      </label>
                      <div className="relative group">
                        <input
                          type="date"
                          className="w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-2xl px-6 py-5 text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-all duration-500 cursor-pointer hover:border-gold-border/40 [color-scheme:dark] text-right"
                          onChange={(e) => updateForm('deliveryDate', e.target.value)}
                          value={formData.deliveryDate}
                        />
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade group-hover:text-gold transition-colors duration-500 pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-text-fade tracking-wider">
                        ملاحظة: يتطلب الحجز المسبق 48 ساعة على الأقل.
                      </p>
                    </div>

                    {/* الرسالة الخطية */}
                    <div className="space-y-4">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-gold font-black block">
                        العبارة المطلوبة على الكعكة (اختياري)
                      </label>
                      <div className="relative">
                        <textarea
                          placeholder="ماذا تحب أن يكتب فنانو الخط لدينا؟"
                          className="w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-2xl px-6 py-5 text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-all duration-500 placeholder:text-text-fade hover:border-gold-border/40 min-h-[120px] resize-none text-right"
                          onChange={(e) => updateForm('message', e.target.value)}
                          value={formData.message}
                        />
                        <Quote className="absolute left-6 top-6 w-5 h-5 text-text-fade/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-6 pt-10">
                    <button onClick={prevStep} className="flex-1 h-14 sm:h-16 rounded-2xl border border-gold-border/10 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black text-text-muted hover:text-gold hover:border-gold/40 transition-all flex items-center justify-center group">
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> الرجوع
                    </button>
                    <Button 
                      variant="gold" 
                      onClick={nextStep}
                      disabled={!formData.deliveryDate || !formData.phoneNumber}
                      className={cn(
                        "flex-[2] h-14 sm:h-16 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black transition-all group",
                        formData.deliveryDate && formData.phoneNumber ? "shadow-gold opacity-100" : "opacity-50 grayscale cursor-not-allowed"
                      )}
                    >
                      مراجعة الطلب <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── الخطوة 5: مراجعة وملخص الطلب ── */}
            {step === 5 && (
              <motion.div key="step5" variants={variants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto w-full">
                <div className="text-center mb-10 sm:mb-16">
                  <div className="w-20 h-20 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="text-3xl sm:text-5xl text-text-primary uppercase tracking-[0.1em] font-display">
                    اكتملت الرؤية!
                  </h2>
                </div>

                <div className="relative bg-bg-card border border-gold-border/20 rounded-[2rem] p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden text-right">
                  {/* تأثير التذكرة الجانبي */}
                  <div className="absolute top-1/2 -right-4 w-8 h-8 bg-bg-base rounded-full -translate-y-1/2 border-l border-gold-border/20" />
                  <div className="absolute top-1/2 -left-4 w-8 h-8 bg-bg-base rounded-full -translate-y-1/2 border-r border-gold-border/20" />
                  <div className="absolute top-1/2 right-8 left-8 border-t border-dashed border-gold-border/20 -translate-y-1/2" />

                  <div className="pb-8 mb-8 relative z-10">
                    <h3 className="text-[11px] uppercase tracking-[0.4em] text-gold font-black text-center mb-8">
                      مواصفات طلبك الخاص
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-text-fade mb-1">المناسبة</p>
                        <p className="text-sm text-text-primary font-bold">{formData.occasion}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-text-fade mb-1">الحجم</p>
                        <p className="text-sm text-text-primary font-bold">{formData.size}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-text-fade mb-1">النكهة</p>
                        <p className="text-sm text-text-primary font-bold">{formData.flavor}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-text-fade mb-1">التاريخ</p>
                        <p className="text-sm text-gold font-bold">{formData.deliveryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <Button onClick={handleSubmit} variant="gold" className="w-full h-16 text-[18px] uppercase tracking-[0.3em] font-black shadow-[0_0_30px_rgba(212,169,79,0.3)]">
                      إرسال الطلب إلى الطهاة
                    </Button>
                    <button onClick={prevStep} className="w-full text-[18px] uppercase tracking-[0.2em] font-black text-text-muted hover:text-gold transition-colors text-center">
                      تعديل المواصفات
                    </button>
                  </div>
                </div>

                <p className="text-center mt-10 text-[10px] text-text-fade tracking-widest leading-relaxed max-w-md mx-auto">
                  بمجرد إرسال الطلب، سيقوم رئيس الطهاة لدينا بمراجعة التفاصيل والتواصل معك عبر الهاتف.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      
   
    </>
  );
}