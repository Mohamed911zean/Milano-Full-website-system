import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { motion } from 'framer-motion'; // ← server component, بنحتاج client wrapper
import ProductsPageClient from '@/components/sections/ProductsPageClient';
import { getActiveCategories, getProductsByCategory, getFeaturedProducts } from '@/lib/services/products';

interface ProductsPageProps {
  searchParams: { category?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categoryId = searchParams.category;

  const [categories, products] = await Promise.all([
    getActiveCategories(),
    categoryId
      ? getProductsByCategory(categoryId)
      : getFeaturedProducts(),
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