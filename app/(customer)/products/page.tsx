import { getActiveCategories, getProductsByCategory, getFeaturedProducts } from '@/lib/services/products'
import ProductGrid from '@/components/customer/ProductGrid'
import CategoryFilter from '@/components/customer/CategoryFilter'

interface ProductsPageProps {
  searchParams: { category?: string }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categoryId = searchParams.category
  
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    categoryId 
      ? getProductsByCategory(categoryId) 
      : getFeaturedProducts(), // Default to featured if no category
  ])

  const activeCategory = categories.find(c => c.id === categoryId)

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
          {activeCategory ? activeCategory.name_ar : 'قائمة الحلويات'}
        </h1>
        <p className="text-text-muted max-w-xl mx-auto">
          اكتشف تشكيلتنا الواسعة من الحلويات الفاخرة، صُنعت بكل حب لتناسب جميع مناسباتكم.
        </p>
      </div>

      {/* Filter */}
      <div className="sticky top-[80px] z-30 bg-dark-base/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b border-dark-border/50">
        <CategoryFilter categories={categories} activeCategoryId={categoryId} />
      </div>

      {/* Grid */}
      <div className="min-h-[40vh]">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
