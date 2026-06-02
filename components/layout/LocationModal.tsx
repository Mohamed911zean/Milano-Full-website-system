'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Search, ChevronRight } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const LOCATIONS = {
  'المنصورة': [
    'قناة السويس',
    'حي الجامعة',
    'شارع الجمهورية',
  ],

  'طلخا': [
    'شارع صلاح سالم',
    'شارع البحر الأعظم',
  ],

  'بلقاس': [
    'شارع أبو رجيلة',
  ],

  'شربين': [
    'شارع الجيش',
  ],
};

export function LocationModal() {
  const { isModalOpen, setIsModalOpen, setLocation } = useLocation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-bg-card border border-border-subtle rounded-3xl overflow-hidden shadow-gold/10 shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display text-text-primary mb-1 uppercase tracking-widest">Select Location</h2>
                <p className="text-sm text-text-secondary">Where should we deliver your sweets?</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-text-muted hover:text-gold transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {!selectedCity ? (
                <div className="grid grid-cols-1 gap-4">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-bold mb-2">Select City</p>
                  {Object.keys(LOCATIONS).map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className="flex items-center justify-between p-5 rounded-2xl bg-bg-elevated border border-border-subtle hover:border-gold-border group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold-subtle flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-text-on-gold transition-all">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-text-primary">{city}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-gold transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <button 
                      onClick={() => setSelectedCity(null)}
                      className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 hover:text-gold-light transition-colors"
                    >
                      &larr; Back to Cities
                    </button>
                    <span className="text-sm text-text-primary font-bold">{selectedCity}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <p className="text-xs uppercase tracking-widest text-text-muted font-bold mb-2">Select Area</p>
                    {LOCATIONS[selectedCity as keyof typeof LOCATIONS].map((area) => (
                      <button
                        key={area}
                        onClick={() => setLocation(selectedCity, area)}
                        className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border-subtle hover:border-gold-border group transition-all text-left"
                      >
                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{area}</span>
                        <div className="w-2 h-2 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-bg-elevated/50 border-t border-border-subtle text-center">
              <p className="text-xs text-text-muted">
                Delivery availability and fees depend on your selected location.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
