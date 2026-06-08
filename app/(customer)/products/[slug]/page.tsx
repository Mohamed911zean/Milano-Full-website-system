// app/(customer)/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetailClient from '@/components/sections/ProductDetailClient'
import type { Category, ProductWithVariants } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*), variants:product_variants(*)`)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as ProductWithVariants & { category: Category | null }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}