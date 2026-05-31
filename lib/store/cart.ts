import { create } from 'zustand'
import { CartItem } from '@/lib/supabase/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (newItem) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.variantId === newItem.variantId
      )

      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += newItem.quantity
        return { items: newItems }
      }

      return { items: [...state.items, newItem] }
    })
  },

  removeItem: (productId, variantId) => {
    set((state) => ({
      items: state.items.filter(
        (item) => item.productId !== productId || item.variantId !== variantId
      ),
    }))
  },

  updateQuantity: (productId, variantId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  },
}))
