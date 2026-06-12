'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { href: '/account/profile', label: 'الملف الشخصي', icon: User },
  { href: '/account/orders', label: 'طلباتي', icon: ShoppingBag },
  { href: '/account/wishlist', label: 'المفضلة', icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="container mx-auto px-6 py-32 md:py-40">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 sticky top-32">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-white">حسابي</h2>
              <p className="text-text-muted text-sm">أهلاً بك في ميلانو</p>
            </div>

            <nav className="flex flex-col gap-2">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 group",
                      isActive
                        ? "bg-gold text-text-on-gold shadow-gold"
                        : "text-text-muted hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-text-on-gold" : "text-gold group-hover:scale-110 transition-transform")} />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="mr-auto w-1.5 h-1.5 rounded-full bg-text-on-gold"
                      />
                    )}
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 mt-4 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>تسجيل الخروج</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
