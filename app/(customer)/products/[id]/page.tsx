import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/services/products'
import ProductDetailClient from '@/components/customer/ProductDetailClient'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
