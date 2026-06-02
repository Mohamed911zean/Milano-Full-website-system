'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Check, ShieldCheck, CreditCard, Truck, Store, MapPin, Gift, Phone, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

type CheckoutStep = 'info' | 'shipping' | 'payment' | 'success';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, totalItems, clearCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('info');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Cairo',
    notes: '',
    pickupBranch: '',
    deliveryDate: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent, nextStep: CheckoutStep) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(nextStep);
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  if (!mounted) return null;

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-bg-base pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-bg-card rounded-full flex items-center justify-center border border-gold-border/10 mb-6">
          <ShieldCheck className="w-10 h-10 text-gold" />
        </div>
        <h1 className="text-3xl font-display text-text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-text-secondary max-w-md mb-8">
          You need to add items to your cart before proceeding to checkout.
        </p>
        <Link 
          href="/shop"
          className="bg-gold text-text-on-gold px-8 py-3.5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const shippingCost = deliveryMethod === 'delivery' ? 50 : 0;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-bg-base pt-[100px] pb-20">
      <div className="container max-w-6xl mx-auto px-4 lg:px-8">
        
        {/* Success State */}
        {step === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center py-20"
          >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mx-auto mb-8">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-display text-text-primary mb-4">
              Order Confirmed
            </h1>
            <p className="text-text-secondary text-lg mb-8">
              Thank you, {formData.firstName}! Your order has been placed successfully.
            </p>
            <div className="bg-bg-card border border-gold-border/10 rounded-2xl p-6 mb-10 text-left">
              <h3 className="font-bold text-text-primary uppercase tracking-widest mb-4 border-b border-border-subtle pb-4">
                Order Details
              </h3>
              <div className="space-y-3 text-sm text-text-secondary">
                <p><span className="text-text-primary font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="text-text-primary font-medium">Email:</span> {formData.email}</p>
                <p><span className="text-text-primary font-medium">Method:</span> {deliveryMethod === 'delivery' ? 'Delivery' : 'Store Pickup'}</p>
                {deliveryMethod === 'delivery' && (
                  <p><span className="text-text-primary font-medium">Address:</span> {formData.address}, {formData.city}</p>
                )}
                {deliveryMethod === 'pickup' && (
                  <p><span className="text-text-primary font-medium">Branch:</span> {formData.pickupBranch}</p>
                )}
              </div>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(212,169,79,0.3)] hover:shadow-[0_6px_28px_rgba(212,169,79,0.45)] transition-all duration-300 active:scale-95"
            >
              Return to Home
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* Left Column: Form Flow */}
            <div className="flex-1 order-1">
              
              {/* Stepper Header */}
              <nav className="flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-8 overflow-x-auto pb-2">
                <Link href="/cart" className="text-gold hover:text-gold-light shrink-0">Cart</Link>
                <ChevronRight className="w-3 h-3 mx-2 text-text-fade shrink-0" />
                <span className={cn("shrink-0 transition-colors", step === 'info' ? 'text-text-primary' : 'text-gold')}>Information</span>
                <ChevronRight className="w-3 h-3 mx-2 text-text-fade shrink-0" />
                <span className={cn("shrink-0 transition-colors", step === 'shipping' ? 'text-text-primary' : (step === 'payment' ? 'text-gold' : 'text-text-muted'))}>Shipping</span>
                <ChevronRight className="w-3 h-3 mx-2 text-text-fade shrink-0" />
                <span className={cn("shrink-0 transition-colors", step === 'payment' ? 'text-text-primary' : 'text-text-muted')}>Payment</span>
              </nav>

              <AnimatePresence mode="wait">
                {/* STEP 1: INFORMATION */}
                {step === 'info' && (
                  <motion.form 
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={(e : any) => handleNextStep(e, 'shipping')}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-display text-text-primary mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-gold" /> Contact Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">First Name *</label>
                          <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Last Name *</label>
                          <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Address *</label>
                          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Phone Number *</label>
                          <div className="flex gap-2">
                            <div className="bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-muted flex items-center shrink-0">
                              +20
                            </div>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="1X XXX XXXX" className="flex-1 bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <Link href="/shop" className="text-gold hover:text-gold-light text-sm font-bold flex items-center gap-1.5">
                        <ArrowLeft className="w-4 h-4" /> Return to Shop
                      </Link>
                      <button type="submit" className="bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-xs shadow-gold hover:-translate-y-0.5 transition-all">
                        Continue to Shipping
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 2: SHIPPING / DELIVERY */}
                {step === 'shipping' && (
                  <motion.form 
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={(e : any) => handleNextStep(e, 'payment')}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-display text-text-primary mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gold" /> Delivery Method
                      </h2>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <label className={cn(
                          "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all",
                          deliveryMethod === 'delivery' ? "bg-gold/10 border-gold text-gold" : "bg-bg-card border-border-subtle text-text-muted hover:border-gold/50"
                        )}>
                          <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="sr-only" />
                          <Truck className="w-6 h-6" />
                          <span className="font-bold text-sm uppercase tracking-wider">Home Delivery</span>
                        </label>
                        <label className={cn(
                          "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all",
                          deliveryMethod === 'pickup' ? "bg-gold/10 border-gold text-gold" : "bg-bg-card border-border-subtle text-text-muted hover:border-gold/50"
                        )}>
                          <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="sr-only" />
                          <Store className="w-6 h-6" />
                          <span className="font-bold text-sm uppercase tracking-wider">Store Pickup</span>
                        </label>
                      </div>

                      {deliveryMethod === 'delivery' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">City / Region *</label>
                            <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all">
                              <option value="Cairo">Cairo</option>
                              <option value="Giza">Giza</option>
                              <option value="Alexandria">Alexandria</option>
                              <option value="North Coast">North Coast</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Detailed Address *</label>
                            <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street, Building, Floor, Apt" className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                          </div>
                        </motion.div>
                      )}

                      {deliveryMethod === 'pickup' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Select Branch *</label>
                            <select required name="pickupBranch" value={formData.pickupBranch} onChange={handleInputChange} className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all">
                              <option value="">Choose a location...</option>
                              <option value="Zamalek">Zamalek Branch - 26th of July Corridor</option>
                              <option value="Heliopolis">Heliopolis Branch - Korba Square</option>
                              <option value="Sheikh Zayed">Sheikh Zayed - Arkan Plaza</option>
                              <option value="New Cairo">New Cairo - Waterway</option>
                            </select>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-1.5 mt-4">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Date & Time Preference
                        </label>
                        <input type="datetime-local" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                      </div>

                      <div className="space-y-1.5 mt-4">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Order Notes (Optional)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="Any special requests or instructions..." className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none" />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button type="button" onClick={() => setStep('info')} className="text-gold hover:text-gold-light text-sm font-bold flex items-center gap-1.5">
                        <ArrowLeft className="w-4 h-4" /> Back to Info
                      </button>
                      <button type="submit" className="bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-xs shadow-gold hover:-translate-y-0.5 transition-all">
                        Continue to Payment
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 'payment' && (
                  <motion.form 
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={(e : any) => { e.preventDefault(); handlePlaceOrder(); }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-display text-text-primary mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gold" /> Payment
                      </h2>
                      <p className="text-sm text-text-secondary mb-6">All transactions are secure and encrypted.</p>

                      <div className="border border-gold-border/20 rounded-xl overflow-hidden bg-bg-card">
                        {/* Option 1: Credit Card */}
                        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gold/5 transition-colors border-b border-gold-border/10">
                          <input type="radio" name="paymentMethod" value="card" defaultChecked className="mt-1 accent-gold" />
                          <div className="flex-1">
                            <span className="font-bold text-sm block mb-1">Credit / Debit Card</span>
                            <span className="text-xs text-text-muted">Pay securely with Visa or Mastercard.</span>
                            
                            {/* Dummy Card Input */}
                            <div className="mt-4 space-y-3">
                              <div className="relative">
                                <input type="text" placeholder="Card Number" className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary" />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                              </div>
                              <div className="flex gap-3">
                                <input type="text" placeholder="MM / YY" className="w-1/2 bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary" />
                                <input type="text" placeholder="CVC" className="w-1/2 bg-bg-base border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary" />
                              </div>
                            </div>
                          </div>
                        </label>
                        
                        {/* Option 2: Cash on Delivery */}
                        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gold/5 transition-colors">
                          <input type="radio" name="paymentMethod" value="cod" className="mt-1 accent-gold" />
                          <div>
                            <span className="font-bold text-sm block mb-1">Cash on Delivery</span>
                            <span className="text-xs text-text-muted">Pay with cash upon delivery.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button type="button" onClick={() => setStep('shipping')} className="text-gold hover:text-gold-light text-sm font-bold flex items-center gap-1.5">
                        <ArrowLeft className="w-4 h-4" /> Back to Shipping
                      </button>
                      <button type="submit" className="bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-on-gold px-8 py-4 rounded-xl font-black uppercase tracking-[0.15em] shadow-[0_4px_20px_rgba(212,169,79,0.35)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Complete Order
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-[420px] shrink-0 order-2">
              <div className="bg-bg-card border border-gold-border/10 rounded-2xl p-5 sm:p-7 sticky top-[120px]">
                <h3 className="font-display text-lg text-text-primary mb-6">Order Summary</h3>
                
                {/* Items List */}
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4a94f transparent' }}>
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gold-border/10 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-text-on-gold rounded-full text-[10px] font-bold flex items-center justify-center z-10">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug">{item.name}</h4>
                        <p className="text-xs text-text-muted mt-1">{item.price} EGP</p>
                      </div>
                      <div className="font-bold text-gold text-sm shrink-0">
                        {(item.price * item.quantity).toLocaleString()} EGP
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-3 text-sm text-text-secondary border-t border-border-subtle pt-6 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-text-primary font-medium">{total.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-text-primary font-medium">
                      {shippingCost === 0 ? (step === 'info' ? 'Calculated next step' : 'Free') : `${shippingCost.toLocaleString()} EGP`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-text-primary font-medium">Included</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border-subtle pt-6 flex justify-between items-end">
                  <span className="text-base font-bold text-text-primary uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-text-muted mr-2">EGP</span>
                    <span className="text-2xl font-display text-gold font-semibold tabular-nums">
                      {finalTotal.toLocaleString()}
                    </span>
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