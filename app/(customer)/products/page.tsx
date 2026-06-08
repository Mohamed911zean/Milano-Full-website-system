// app/(customer)/products/page.tsx
import ProductsPageClient from '@/components/sections/ProductsPageClient'
import { getActiveCategories, getProductsByCategory, getActiveProducts } from '@/lib/services/products'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Next.js 15: searchParams بقى async — لازم await
  const params = await searchParams
  const categoryId = params.category

  const [categories, products] = await Promise.all([
    getActiveCategories(),
    categoryId
      ? getProductsByCategory(categoryId)
      : getActiveProducts(),
  ])

  const activeCategory = categories.find(c => c.id === categoryId) ?? null

  return (
    <ProductsPageClient
      categories={categories}
      products={products}
      activeCategory={activeCategory}
      activeCategoryId={categoryId}
    />
  )
}