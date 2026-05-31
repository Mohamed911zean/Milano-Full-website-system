"use client"

import { useCart } from '@/lib/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { X, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const subtotal = totalPrice()
  const count = totalItems()

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-dark-base/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-[70] w-full max-w-md bg-dark-surface shadow-2xl transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-gold" />
              <h2 className="text-xl font-bold text-text-primary">سلة التسوق</h2>
              <span className="bg-gold/10 text-gold text-xs font-bold px-2 py-0.5 rounded-full">
                {count} منتجات
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-text-muted hover:text-gold transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-dark-base flex items-center justify-center text-text-disabled">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text-primary">سلتك فاضية</h3>
                  <p className="text-text-muted text-sm">ابدأ بإضافة بعض الحلويات الفاخرة لسلتك</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-gold text-dark-base font-bold rounded-xl hover:bg-gold-light transition-colors"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 group">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-dark-border flex-shrink-0">
                    {/* Placeholder for item image if we had it in cart item, 
                        for now let's just use a styled div or handle it if we add it to CartItem */}
                    <div className="w-full h-full bg-dark-card flex items-center justify-center text-gold/20">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-text-primary text-sm line-clamp-1">{item.productNameAr}</h4>
                      <button 
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-text-disabled hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gold text-xs font-medium">{item.variantNameAr}</p>
                    {item.cakeText && (
                      <p className="text-text-disabled text-[10px] italic">" {item.cakeText} "</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-dark-base rounded-lg border border-dark-border overflow-hidden scale-90 -mr-2">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="p-1.5 text-text-muted hover:text-gold transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-text-primary">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="p-1.5 text-text-muted hover:text-gold transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-gold text-sm">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-dark-border bg-dark-surface space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-text-muted">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-disabled text-xs">
                  <span>رسوم التوصيل</span>
                  <span>تُحسب عند إتمام الطلب</span>
                </div>
                <div className="divider-gold my-4" />
                <div className="flex justify-between text-text-primary font-bold text-xl">
                  <span>الإجمالي</span>
                  <span className="text-gold">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-4 bg-gold text-dark-base font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
              >
                إتمام الطلب
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
