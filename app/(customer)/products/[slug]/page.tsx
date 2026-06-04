import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductDetailClient from '@/components/sections/ProductDetailClient';
import type { Category, ProductWithVariants } from '@/lib/supabase/types';

interface Props {
  params: { slug: string };
}

async function getProduct(id: string): Promise<(ProductWithVariants & { category: Category | null }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as ProductWithVariants & { category: Category | null };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
