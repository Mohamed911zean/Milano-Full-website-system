import Image from 'next/image'
import Link from 'next/link'
import { ProductWithVariants } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: ProductWithVariants
}

export default function ProductCard({ product }: ProductCardProps) {
  const defaultVariant = product.variants.find(v => v.is_default) || product.variants[0]
  const price = defaultVariant ? defaultVariant.price : product.base_price

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group bg-dark-surface rounded-xl border border-dark-border overflow-hidden hover:border-gold/40 transition-all duration-300 flex flex-col"
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden">
        {product.images?.[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.name_ar} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-dark-card flex items-center justify-center text-text-disabled">
            لا توجد صورة
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.preparation_type === 'made_to_order' && (
            <span className="bg-dark-base/80 backdrop-blur-sm border border-gold text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
              يتجهز خصيصاً
            </span>
          )}
          {product.is_featured && (
            <span className="bg-gold text-dark-base text-[10px] font-bold px-2 py-0.5 rounded-full">
              الأكثر طلباً
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-text-primary font-semibold text-[15px] group-hover:text-gold transition-colors line-clamp-1">
          {product.name_ar}
        </h3>
        
        {product.preparation_type === 'made_to_order' && product.prep_duration_minutes && (
          <p className="text-text-disabled text-[11px] mt-1">
            يتجهز في {product.prep_duration_minutes} دقيقة
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-gold font-bold text-lg">
            {formatPrice(price)}
          </span>
          <div className="bg-gold/10 text-gold text-[10px] font-bold px-3 py-1.5 rounded-md group-hover:bg-gold group-hover:text-dark-base transition-all duration-300">
            أضف للسلة
          </div>
        </div>
      </div>
    </Link>
  )
}
