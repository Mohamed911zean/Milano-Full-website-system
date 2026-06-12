'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel, GoldDivider } from '@/components/ui/Typography';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [updating, setUpdating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || '');
        setPhone(user.user_metadata?.phone || '');
        setAddress(user.user_metadata?.address || '');
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase.auth]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: phone,
        address: address,
      }
    });

    if (error) {
      alert(error.message);
      setUpdating(false);
      return;
    } 

    if (user) {
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address
        })
        .eq('id', user.id);

      if (profileError) {
        alert("حدث خطأ أثناء تحديث الملف الشخصي");
      } else {
        alert("تم تحديث الملف الشخصي بنجاح");
      }
    }
    
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <SectionLabel>المعلومات الشخصية</SectionLabel>
          <h1 className="text-4xl font-display font-bold text-white">الملف الشخصي</h1>
        </div>
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center text-gold overflow-hidden">
            <User className="w-10 h-10" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold text-text-on-gold rounded-full flex items-center justify-center border-4 border-bg-base hover:bg-gold-light transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="glass-card rounded-3xl p-8 md:p-12">
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">الاسم بالكامل</label>
            <div className="relative">
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-white focus:border-gold transition-all outline-none"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">البريد الإلكتروني</label>
            <div className="relative">
              <input 
                type="email" 
                value={user?.email}
                disabled
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-text-muted cursor-not-allowed outline-none"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">رقم الهاتف</label>
            <div className="relative">
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-white focus:border-gold transition-all outline-none"
                dir="ltr"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">عنوان التوصيل</label>
            <div className="relative">
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-sm text-white focus:border-gold transition-all outline-none resize-none"
              />
              <MapPin className="absolute left-4 top-6 w-5 h-5 text-text-fade" />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto h-14"
              disabled={updating}
            >
              {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
