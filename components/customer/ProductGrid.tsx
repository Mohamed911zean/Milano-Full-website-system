import ProductCard from './ProductCard'
import { ProductWithVariants } from '@/lib/supabase/types'

interface ProductGridProps {
  products: ProductWithVariants[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-muted">لا توجد منتجات حالياً</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
