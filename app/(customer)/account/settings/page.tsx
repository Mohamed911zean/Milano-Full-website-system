'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Bell, Shield, Moon, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel, GoldDivider } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [language, setLanguage] = useState('ar');
  const [notifications, setNotifications] = useState({
    orders: true,
    offers: false,
    support: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // Show success feedback
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <SectionLabel>تخصيص التجربة</SectionLabel>
        <h1 className="text-4xl font-display font-bold text-white">الإعدادات</h1>
      </header>

      <div className="space-y-8">
        {/* Language Section */}
        <section className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">اللغة</h3>
              <p className="text-text-muted text-sm font-light">اختر اللغة التي تفضل استخدامها في المتجر</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['ar', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "flex items-center justify-between px-8 py-5 rounded-2xl border transition-all duration-500",
                  language === lang
                    ? "bg-gold/10 border-gold text-gold shadow-gold/10"
                    : "bg-white/5 border-white/10 text-text-muted hover:border-gold/40"
                )}
              >
                <span className="font-bold uppercase tracking-widest text-sm">
                  {lang === 'ar' ? 'العربية' : 'English'}
                </span>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  language === lang ? "border-gold bg-gold" : "border-text-fade"
                )}>
                  {language === lang && <div className="w-2 h-2 rounded-full bg-text-on-gold" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">التنبيهات</h3>
              <p className="text-text-muted text-sm font-light">إدارة كيف ومتى تتلقى الإشعارات منا</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'orders', label: 'تحديثات الطلبات', desc: 'الحصول على إشعارات حول حالة طلبك وتأكيد الاستلام' },
              { id: 'offers', label: 'العروض الحصرية', desc: 'تلقي تنبيهات حول الخصومات والمنتجات الجديدة' },
              { id: 'support', label: 'رسائل الدعم', desc: 'تلقي تنبيهات عند الرد على تذاكر الدعم الخاصة بك' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="space-y-1 text-right">
                  <h4 className="font-bold text-text-primary text-sm">{item.label}</h4>
                  <p className="text-text-fade text-[11px] font-light">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                  className={cn(
                    "w-14 h-8 rounded-full relative transition-all duration-500",
                    notifications[item.id as keyof typeof notifications] ? "bg-gold" : "bg-white/10"
                  )}
                >
                  <motion.div
                    animate={{ x: notifications[item.id as keyof typeof notifications] ? (document.dir === 'rtl' ? -28 : 28) : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white absolute top-1 left-1 shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">الأمان</h3>
              <p className="text-text-muted text-sm font-light">تغيير كلمة المرور وإدارة أمان حسابك</p>
            </div>
          </div>

          <Button variant="outline" className="w-full h-14">
            تغيير كلمة المرور
          </Button>
        </section>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            className="w-full md:w-auto h-14 px-12"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                حفظ الإعدادات <Save className="w-5 h-5 mr-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
