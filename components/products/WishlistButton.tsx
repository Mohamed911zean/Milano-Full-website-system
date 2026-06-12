'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleWishlist } from '@/app/actions/wishlist';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import type { ProductWithVariants } from '@/lib/supabase/types';

export default function WishlistButton({ product }: { product: ProductWithVariants }) {
  const { isInWishlist, addItem, removeItem, loading } = useWishlist();
  const pathname = usePathname();
  const isWishlisted = isInWishlist(product.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      if (isWishlisted) {
        await removeItem(product.id);
        await toggleWishlist(product.id, pathname);
      } else {
        await addItem(product);
        await toggleWishlist(product.id, pathname);
      }
    } catch (error: any) {
      // Revert on error
      if (error.message?.includes('تسجيل الدخول')) {
        alert(error.message);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm z-20 backdrop-blur-md",
        isWishlisted 
          ? "bg-red-500/90 text-white border border-red-500 hover:bg-red-600" 
          : "bg-bg-base/70 text-text-muted border border-white/10 hover:text-red-400 hover:border-red-400/50"
      )}
      disabled={loading}
    >
      <Heart className={cn("w-4 h-4 transition-transform", isWishlisted && "fill-current scale-110")} />
    </button>
  );
}
