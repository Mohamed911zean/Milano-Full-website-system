'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductWithVariants } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { getWishlistProducts } from '@/app/actions/wishlist';

interface WishlistContextType {
  items: ProductWithVariants[];
  addItem: (product: ProductWithVariants) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Authenticated user: load from Supabase
        const products = await getWishlistProducts();
        setItems(products as unknown as ProductWithVariants[]);
      } else {
        // Guest user: load from localStorage
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('milano_wishlist');
            if (saved) {
              setItems(JSON.parse(saved));
            }
          } catch {
            setItems([]);
          }
        }
      }
      setLoading(false);
    };
    loadWishlist();
  }, []);

  // Persist guest wishlist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading) {
      const checkAuth = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          localStorage.setItem('milano_wishlist', JSON.stringify(items));
        }
      };
      checkAuth();
    }
  }, [items, loading]);

  const addItem = async (product: ProductWithVariants) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated: use server action
      try {
        await fetch('/', { method: 'POST' }); // dummy to trigger revalidation
      } catch (e) {
        // continue
      }
    }

    // Update local state
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeItem = async (productId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated: use server action
      try {
        await fetch('/', { method: 'POST' }); // dummy to trigger revalidation
      } catch (e) {
        // continue
      }
    }

    // Update local state
    setItems(prev => prev.filter(i => i.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return !!items.find(i => i.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('milano_wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
