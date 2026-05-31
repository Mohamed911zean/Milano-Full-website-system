"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ProductWithVariants, Category, CartItem } from '@/lib/supabase/types'
import { useCart } from '@/lib/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { Plus, Minus, ShoppingCart, ArrowRight, Clock } from 'lucide-react'

interface ProductDetailClientProps {
  product: ProductWithVariants & { category: Category }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  
  const defaultVariant = product.variants.find(v => v.is_default) || product.variants[0]
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant)
  const [quantity, setQuantity] = useState(1)
  const [cakeText, setCakeText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    const cartItem: CartItem = {
      productId: product.id,
      variantId: selectedVariant?.id || '',
      productNameAr: product.name_ar,
      variantNameAr: selectedVariant?.name_ar || '',
      unitPrice: selectedVariant?.price || product.base_price,
      quantity,
      cakeText: product.allows_text_on_cake ? cakeText : undefined,
    }

    addItem(cartItem)
    
    // Simple feedback, then maybe open drawer (later)
    setTimeout(() => {
      setIsAdding(false)
      // For now just show a success state or redirect
    }, 500)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors mb-8"
      >
        <ArrowRight className="w-4 h-4" /> العودة
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-3xl overflow-hidden border border-dark-border">
            {product.images?.[0] ? (
              <Image 
                src={product.images[0]} 
                alt={product.name_ar} 
                fill 
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-dark-card flex items-center justify-center text-text-disabled text-xl">
                لا توجد صورة
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-gold font-bold text-sm tracking-widest uppercase">
              {product.category.name_ar}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
              {product.name_ar}
            </h1>
            <p className="text-text-muted text-lg leading-relaxed">
              {product.description_ar}
            </p>
          </div>

          <div className="divider-gold" />

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-text-primary">اختر الحجم / النوع</label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "px-6 py-3 rounded-xl border font-bold text-sm transition-all duration-300",
                      selectedVariant.id === variant.id
                        ? "bg-gold border-gold text-dark-base shadow-lg shadow-gold/20"
                        : "bg-dark-surface border-dark-border text-text-muted hover:border-gold/40 hover:text-gold"
                    )}
                  >
                    {variant.name_ar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cake Text Input */}
          {product.allows_text_on_cake && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-text-primary">اكتب على التورتة (اختياري)</label>
              <input
                type="text"
                value={cakeText}
                onChange={(e) => setCakeText(e.target.value)}
                placeholder="مثال: عيد ميلاد سعيد سارة"
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-text-primary focus:outline-none focus:border-gold transition-colors"
                dir="rtl"
              />
            </div>
          )}

          {/* Prep Time Note */}
          {product.preparation_type === 'made_to_order' && product.prep_duration_minutes && (
            <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/10 rounded-xl text-gold">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">
                هذا المنتج يُجهز خصيصاً لك، يستغرق تحضيره حوالي {product.prep_duration_minutes} دقيقة.
              </span>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="pt-4 space-y-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gold">
                {formatPrice(selectedVariant?.price || product.base_price)}
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Quantity Selector */}
              <div className="flex items-center bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 text-text-muted hover:text-gold transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold text-text-primary">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 text-text-muted hover:text-gold transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={cn(
                  "flex-grow flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300",
                  isAdding 
                    ? "bg-gold/50 text-dark-base cursor-not-allowed"
                    : "bg-gold text-dark-base hover:bg-gold-light hover:scale-[1.02] active:scale-95 shadow-lg shadow-gold/20"
                )}
              >
                <ShoppingCart className="w-6 h-6" />
                {isAdding ? 'يتم الإضافة...' : 'أضف للسلة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
