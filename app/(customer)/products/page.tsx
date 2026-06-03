import ProductsPageClient from '@/components/sections/ProductsPageClient';
import { getActiveCategories, getProductsByCategory, getActiveProducts } from '@/lib/services/products';

interface ProductsPageProps {
  searchParams: { category?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categoryId = searchParams.category;

  const [categories, products] = await Promise.all([
    getActiveCategories(),
    categoryId
      ? getProductsByCategory(categoryId)
      : getActiveProducts(),
  ]);

  const activeCategory = categories.find(c => c.id === categoryId) ?? null;

  return (
    <ProductsPageClient
      categories={categories}
      products={products}
      activeCategory={activeCategory}
      activeCategoryId={categoryId}
    />
  );
}
