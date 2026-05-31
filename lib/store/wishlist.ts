import { create } from 'zustand'
import { ProductWithVariants } from '@/lib/supabase/types'

interface WishlistStore {
  items: ProductWithVariants[]
  addItem: (product: ProductWithVariants) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      if (state.items.find((item) => item.id === product.id)) {
        return state
      }
      return { items: [...state.items, product] }
    })
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }))
  },

  isInWishlist: (productId) => {
    return !!get().items.find((item) => item.id === productId)
  },

  clearWishlist: () => set({ items: [] }),
}))
