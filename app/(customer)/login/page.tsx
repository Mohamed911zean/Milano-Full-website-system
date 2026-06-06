'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel, GoldDivider } from '@/components/ui/Typography';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
    } else {
      // ارجع للصفحة اللي كان رايحلها، أو للـ account
      const redirectTo = searchParams.get('redirectTo') || '/account/profile';
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="glass-card p-8 md:p-12 rounded-3xl shadow-premium relative z-10 text-center">
      <SectionLabel className="justify-center">مرحباً بك مجدداً</SectionLabel>
      <h1 className="font-display text-4xl font-bold text-white mb-2">تسجيل الدخول</h1>
      <p className="text-text-secondary text-sm mb-8 font-light">ادخل إلى عالم ميلانو للحلويات الفاخرة</p>

      <form onSubmit={handleLogin} className="space-y-6 text-right">
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
          <div className="flex justify-between items-center px-1">
            <Link href="#" className="text-[10px] text-gold hover:text-gold-light transition-colors font-bold uppercase tracking-widest">نسيت كلمة المرور؟</Link>
            <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold">كلمة المرور</label>
          </div>
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
          <p className="text-red-400 text-xs text-center font-medium bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-14" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
        </Button>
      </form>

      <GoldDivider centered />

      <p className="text-text-secondary text-sm font-light">
        ليس لديك حساب؟{' '}
        <Link href="/signup" className="text-gold font-bold hover:text-gold-light transition-colors">إنشاء حساب جديد</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Suspense مطلوب عشان useSearchParams */}
        <Suspense fallback={<div className="h-96 glass-card rounded-3xl animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}