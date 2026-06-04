'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function Newsletter() {

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section className="relative py-32 bg-bg-base overflow-hidden">
      {/* Premium Background Layering */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/why-choose-us.jpg"
          alt={('sections.newsletter_background')}
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-base/40 to-bg-base" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold mb-6 block">
              {('sections.stay_enchanted')}
            </span>
            <h2 className="text-h2 text-text-primary font-display mb-6">
              {('sections.join_the_elite_circle')}
            </h2>
            <p className="text-text-secondary mb-12 max-w-md mx-auto tracking-wide text-sm">
              {('sections.subscribe_to_receive_exclusive')}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 py-8"
              >
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success border border-success/20 shadow-lg shadow-success/10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-display text-text-primary">
                    {('sections.thank_you')}
                  </h4>
                  <p className="text-text-muted">
                    {('sections.you_ve_successfully_joined_our')}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className={`flex flex-col md:flex-row gap-4 max-w-2xl mx-auto ${('sections.')}`}
              >
                <div className="flex-1 group relative">
                  <input
                    type="email"
                    placeholder={('sections.email_address')}
                    required
                    className={`w-full bg-bg-card/50 backdrop-blur-md border border-gold-border/20 rounded-full px-8 py-5 text-text-primary focus:outline-none focus:border-gold transition-all duration-300 group-hover:border-gold-border/40 ${('sections.')}`}
                  />
                  <div className="absolute inset-0 rounded-full bg-gold/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <Button
                  type="submit"
                  variant="gold"
                  disabled={status === 'loading'}
                  className="md:w-52 h-[62px] shadow-gold group"
                >
                  {status === 'loading'
                    ? (('sections.joining'))
                    : (
                      <>
                        {('sections.subscribe')}{' '}
                        <span className={`ml-2 transition-transform duration-500 ${('sections.group_hover_translate_x_1')} inline-block`}>
                          {('sections.')}
                        </span>
                      </>
                    )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
