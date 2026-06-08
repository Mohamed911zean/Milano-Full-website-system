'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ArrowLeft, Check, ShieldCheck,
  Truck, Store, Phone, User, Loader2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { submitOrder } from '@/app/actions/orders';

type Step = 'info' | 'shipping' | 'review' | 'success';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  notes: string;
  pickupBranch: string;
  deliveryMethod: 'delivery' | 'pickup';
}

const BRANCHES = [
  'فرع قناة السويس — المنصورة',
  'فرع شارع صلاح سالم — طلخا',
  'فرع البحر الأعظم — طلخا',
  'فرع بلقاس',
  'فرع شربين',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    notes: '',
    pickupBranch: '',
    deliveryMethod: 'delivery',
  });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-bg-base pt-32 flex flex-col items-center justify-center text-center px-6">
        <ShieldCheck className="w-16 h-16 text-gold mb-6 opacity-50" />
        <h1 className="text-2xl font-display text-text-primary mb-4">السلة فاضية</h1>
        <Link href="/products" className="text-gold hover:text-gold-light transition-colors text-sm">
          ← ارجع للمنتجات
        </Link>
      </div>
    );
  }

  const shippingCost = form.deliveryMethod === 'delivery' ? 50 : 0;
  const finalTotal = total + shippingCost;

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const inputClass = "w-full h-14 bg-bg-card border border-white/10 rounded-xl px-5 text-sm text-white placeholder:text-text-fade focus:border-gold outline-none transition-all";

  // ── الخطوة الأهم: الإرسال الفعلي للـ DB ──
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // بنبني الـ items بالشكل اللي الـ schema بتاخده
      const orderItems = items.map(item => ({
        productId:     String(item.id),
        productNameAr: item.name,
        variantNameAr: undefined,
        unitPrice:     item.price,
        quantity:      item.quantity,
        cakeText:      undefined,
      }));

      const result = await submitOrder({
        customerName:    `${form.firstName} ${form.lastName}`.trim(),
        customerPhone:   form.phone,
        fulfillmentType: form.deliveryMethod,
        deliveryAddress: form.deliveryMethod === 'delivery'
          ? form.address
          : form.pickupBranch,
        customerNotes:   form.notes || undefined,
        items:           orderItems,
      });

      if (!result.success) {
        setError(result.message ?? 'حصل خطأ، حاول تاني');
        setLoading(false);
        return;
      }

      // نجح
      setOrderNumber(result.orderNumber ?? null);
      clearCart();
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Checkout error:', err);
      setError('حصل خطأ غير متوقع، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base pt-24 pb-20">
      <div className="container max-w-5xl mx-auto px-4">

        {/* ── Success ── */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center py-20 space-y-8"
          >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mx-auto">
              <Check className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-display text-white">تم استلام طلبك!</h1>
              <p className="text-text-secondary">شكراً لثقتك في ميلانو، سنتواصل معك قريباً لتأكيد الموعد.</p>
            </div>
            {orderNumber && (
              <div className="glass-card rounded-2xl p-8 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-fade">رقم طلبك</p>
                <p className="text-3xl font-display text-gold font-bold tracking-wider">{orderNumber}</p>
                <p className="text-xs text-text-fade">احتفظ بهذا الرقم لمتابعة طلبك</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {orderNumber && (
                <Link
                  href={`/track-order?number=${orderNumber}&phone=${form.phone}`}
                  className="px-8 py-3 border border-gold/30 text-gold rounded-full text-sm font-bold hover:bg-gold/10 transition-all"
                >
                  تتبع الطلب
                </Link>
              )}
              <Link
                href="/"
                className="px-8 py-3 bg-gold text-text-on-gold rounded-full text-sm font-bold hover:bg-gold-light transition-all"
              >
                العودة للرئيسية
              </Link>
            </div>
          </motion.div>
        )}

        {step !== 'success' && (
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left: Steps ── */}
            <div className="flex-1 space-y-6">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest flex-wrap">
                <Link href="/products" className="text-gold">المنتجات</Link>
                <ChevronRight className="w-3 h-3 text-text-fade" />
                <span className={step === 'info' ? 'text-white' : 'text-text-fade'}>البيانات</span>
                <ChevronRight className="w-3 h-3 text-text-fade" />
                <span className={step === 'shipping' ? 'text-white' : 'text-text-fade'}>التوصيل</span>
                <ChevronRight className="w-3 h-3 text-text-fade" />
                <span className={step === 'review' ? 'text-white' : 'text-text-fade'}>مراجعة</span>
              </nav>

              <AnimatePresence mode="wait">

                {/* ── Step 1: بيانات العميل ── */}
                {step === 'info' && (
                  <motion.form
                    key="info"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    onSubmit={e => { e.preventDefault(); setStep('shipping'); window.scrollTo({ top: 0 }); }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-xl font-display text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-gold" /> بياناتك
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">الاسم الأول *</label>
                        <input required type="text" value={form.firstName}
                          onChange={e => update('firstName', e.target.value)}
                          className={inputClass} placeholder="محمد" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">اسم العيلة *</label>
                        <input required type="text" value={form.lastName}
                          onChange={e => update('lastName', e.target.value)}
                          className={inputClass} placeholder="علي" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">رقم التليفون *</label>
                      <div className="flex gap-2">
                        <div className="h-14 bg-bg-card border border-white/10 rounded-xl px-4 flex items-center text-sm text-text-muted shrink-0">+20</div>
                        <input
                          required type="tel" value={form.phone}
                          onChange={e => update('phone', e.target.value)}
                          pattern="^01[0-9]{9}$"
                          title="رقم تليفون مصري صحيح (01xxxxxxxxx)"
                          className={cn(inputClass, 'flex-1')}
                          placeholder="01xxxxxxxxx"
                          dir="ltr"
                        />
                      </div>
                      <p className="text-[10px] text-text-fade px-1">مثال: 01012345678</p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-10 py-4 bg-gold text-text-on-gold rounded-full font-black text-[11px] uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-gold">
                        التالي — طريقة التوصيل
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* ── Step 2: طريقة التوصيل ── */}
                {step === 'shipping' && (
                  <motion.form
                    key="shipping"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    onSubmit={e => { e.preventDefault(); setStep('review'); window.scrollTo({ top: 0 }); }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-display text-white flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gold" /> طريقة الاستلام
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { val: 'delivery', icon: Truck, label: 'توصيل للباب', sub: '+50 جنيه' },
                        { val: 'pickup', icon: Store, label: 'استلام من الفرع', sub: 'مجاناً' },
                      ].map(opt => (
                        <label key={opt.val} className={cn(
                          'cursor-pointer border rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300',
                          form.deliveryMethod === opt.val
                            ? 'bg-gold/10 border-gold text-gold'
                            : 'bg-bg-card border-white/10 text-text-muted hover:border-gold/40'
                        )}>
                          <input type="radio" className="sr-only" value={opt.val}
                            checked={form.deliveryMethod === opt.val}
                            onChange={() => update('deliveryMethod', opt.val)} />
                          <opt.icon className="w-6 h-6" />
                          <div className="text-center">
                            <p className="font-bold text-sm">{opt.label}</p>
                            <p className="text-xs opacity-70">{opt.sub}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {form.deliveryMethod === 'delivery' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">العنوان بالتفصيل *</label>
                        <input required type="text" value={form.address}
                          onChange={e => update('address', e.target.value)}
                          className={inputClass}
                          placeholder="مثال: طلخا — شارع صلاح سالم — بجوار مسجد..."
                        />
                      </div>
                    )}

                    {form.deliveryMethod === 'pickup' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">اختار الفرع *</label>
                        <select required value={form.pickupBranch}
                          onChange={e => update('pickupBranch', e.target.value)}
                          className={cn(inputClass, 'cursor-pointer appearance-none')}>
                          <option value="">اختار فرع...</option>
                          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">ملاحظات (اختياري)</label>
                      <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3}
                        placeholder="أي تعليمات خاصة للطلب..."
                        className="w-full bg-bg-card border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-text-fade focus:border-gold outline-none transition-all resize-none" />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button type="button" onClick={() => setStep('info')}
                        className="flex items-center gap-2 text-gold text-sm font-bold hover:text-gold-light transition-colors">
                        <ArrowLeft className="w-4 h-4" /> رجوع
                      </button>
                      <button type="submit"
                        className="px-10 py-4 bg-gold text-text-on-gold rounded-full font-black text-[11px] uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-gold">
                        مراجعة الطلب
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* ── Step 3: مراجعة وتأكيد ── */}
                {step === 'review' && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-display text-white">مراجعة الطلب</h2>

                    {/* ملخص البيانات */}
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-text-fade mb-1">الاسم</p>
                          <p className="text-white font-medium">{form.firstName} {form.lastName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-text-fade mb-1">التليفون</p>
                          <p className="text-white font-medium" dir="ltr">{form.phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] uppercase tracking-widest text-text-fade mb-1">
                            {form.deliveryMethod === 'delivery' ? 'عنوان التوصيل' : 'الفرع'}
                          </p>
                          <p className="text-white font-medium">
                            {form.deliveryMethod === 'delivery' ? form.address : form.pickupBranch}
                          </p>
                        </div>
                        {form.notes && (
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase tracking-widest text-text-fade mb-1">ملاحظات</p>
                            <p className="text-white font-medium">{form.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <button onClick={() => setStep('shipping')}
                        className="flex items-center gap-2 text-gold text-sm font-bold hover:text-gold-light transition-colors">
                        <ArrowLeft className="w-4 h-4" /> تعديل
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="flex items-center gap-2 px-10 py-4 bg-gold text-text-on-gold rounded-full font-black text-[11px] uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-gold disabled:opacity-60 disabled:translate-y-0"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="w-full lg:w-[360px] shrink-0">
              <div className="glass-card rounded-2xl p-6 sticky top-28 space-y-5">
                <h3 className="font-display text-lg text-white">ملخص الطلب</h3>

                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold text-text-on-gold text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                        <p className="text-xs text-text-fade">{item.price} جنيه</p>
                      </div>
                      <p className="text-gold font-bold text-sm shrink-0">
                        {(item.price * item.quantity).toLocaleString()} جنيه
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>المجموع الفرعي</span>
                    <span>{total.toLocaleString()} جنيه</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>التوصيل</span>
                    <span>{shippingCost === 0 ? 'مجاناً' : `${shippingCost} جنيه`}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-base border-t border-white/10 pt-3">
                    <span>الإجمالي</span>
                    <span className="text-gold text-xl font-display">{finalTotal.toLocaleString()} جنيه</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}