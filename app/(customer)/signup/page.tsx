'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel, GoldDivider } from '@/components/ui/Typography';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Create profile record (usually via trigger, but let's assume we need to handle it or redirect)
      router.push('/account');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-12 rounded-3xl shadow-premium relative z-10 text-center">
          <SectionLabel className="justify-center">انضم إلينا</SectionLabel>
          <h1 className="font-display text-4xl font-bold text-white mb-2">حساب جديد</h1>
          <p className="text-text-secondary text-sm mb-8 font-light">ابدأ تجربتك مع حلويات ميلانو الراقية</p>
          
          <form onSubmit={handleSignup} className="space-y-4 text-right">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">الاسم بالكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-white placeholder:text-text-fade focus:border-gold focus:bg-white/10 transition-all duration-300 outline-none"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">رقم الهاتف</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-white placeholder:text-text-fade focus:border-gold focus:bg-white/10 transition-all duration-300 outline-none"
                  required
                  dir="ltr"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-white placeholder:text-text-fade focus:border-gold focus:bg-white/10 transition-all duration-300 outline-none"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-sm text-white placeholder:text-text-fade focus:border-gold focus:bg-white/10 transition-all duration-300 outline-none"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-fade" />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center font-medium animate-pulse">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 mt-4" 
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الحساب'}
            </Button>
          </form>

          <GoldDivider centered />

          <p className="text-text-secondary text-sm font-light">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-gold font-bold hover:text-gold-light transition-colors">تسجيل الدخول</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
