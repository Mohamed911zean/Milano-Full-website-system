// lib/services/products.ts
// كل query خاصة بالمنتجات بتمشي من هنا
// مش من الـ components مباشرة

import { createClient } from '@/lib/supabase/server'
import type { ProductWithVariants, ProductWithCategory, Category } from '@/lib/supabase/types'

// ============================================================
// Categories
// ============================================================

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`)
  return data
}

// ============================================================
// Products
// ============================================================

export async function getProductsByCategory(
  categoryId: string
): Promise<ProductWithVariants[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants (*)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data as ProductWithVariants[]
}

export async function getActiveProducts(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants (*)
    `)
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data as ProductWithVariants[]
}

export async function getFeaturedProducts(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants (*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(8)

  if (error) throw new Error(`Failed to fetch featured products: ${error.message}`)
  return data as ProductWithVariants[]
}

export async function getProductBySlug(
  id: string
): Promise<ProductWithVariants & { category: Category } | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories (*),
      variants:product_variants (*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null  // not found
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  return data as ProductWithVariants & { category: Category }
}

// ============================================================
// Admin: Products CRUD (بيتستخدم في الـ dashboard فقط)
// ============================================================

export async function getAllProductsAdmin(): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories (*)
    `)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data as ProductWithCategory[]
}

export async function toggleProductActive(
  productId: string,
  isActive: boolean
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId)

  if (error) throw new Error(`Failed to update product: ${error.message}`)
}

// ============================================================
// Image Upload — بيحصل client-side مباشرة للـ Storage
// ============================================================

// بيتستدعى من الـ browser قبل إنشاء/تعديل المنتج
// بيرجع الـ public URL اللي هيتحفظ في الـ DB
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  // 1. Resize + compress في الـ browser قبل الـ upload
  const compressed = await compressImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.82,         // جودة كويسة مع حجم معقول
    outputType: 'image/webp',
  })

  // 2. اسم ثابت: product-id.webp — بيحل محل الصورة القديمة تلقائياً
  const fileName = `${productId}.webp`
  const filePath = `products/${fileName}`

  const supabase = await createClient()

  const { error } = await supabase.storage
    .from('product-images')    // public bucket
    .upload(filePath, compressed, {
      upsert: true,            // لو موجودة بتحل محلها
      contentType: 'image/webp',
      cacheControl: '3600',
    })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  // نضيف timestamp عشان نكسر الـ cache لما الصورة تتغير
  return `${data.publicUrl}?v=${Date.now()}`
}

// Canvas-based image compression — بتشتغل في الـ browser بدون libraries
async function compressImage(
  file: File,
  options: {
    maxWidth: number
    maxHeight: number
    quality: number
    outputType: string
  }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // احسب الأبعاد الجديدة مع الحفاظ على النسبة
      let { width, height } = img
      if (width > options.maxWidth || height > options.maxHeight) {
        const ratio = Math.min(
          options.maxWidth / width,
          options.maxHeight / height
        )
        width  = Math.round(width  * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Compression failed')); return }
          resolve(blob)
        },
        options.outputType,
        options.quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

// ============================================================
// Create Product
// ============================================================

export interface CreateProductInput {
  categoryId:          string
  nameAr:              string
  nameEn?:             string
  descriptionAr?:      string
  basePrice:           number
  pricingUnit:         import('@/lib/supabase/types').PricingUnit
  preparationType:     import('@/lib/supabase/types').PreparationType
  prepDurationMinutes?: number
  allowsTextOnCake:    boolean
  isFeatured:          boolean
  sortOrder:           number
  imageUrl?:           string   // جاي من uploadProductImage
  variants:            { nameAr: string; price: number; isDefault: boolean; sortOrder: number }[]
}

export async function createProduct(input: CreateProductInput): Promise<string> {
  const supabase = await createClient()

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      category_id:           input.categoryId,
      name_ar:               input.nameAr,
      name_en:               input.nameEn ?? null,
      description_ar:        input.descriptionAr ?? null,
      base_price:            input.basePrice,
      pricing_unit:          input.pricingUnit,
      preparation_type:      input.preparationType,
      prep_duration_minutes: input.prepDurationMinutes ?? null,
      allows_text_on_cake:   input.allowsTextOnCake,
      is_featured:           input.isFeatured,
      sort_order:            input.sortOrder,
      images:                input.imageUrl ? [input.imageUrl] : [],
    })
    .select('id')
    .single()

  if (productError) throw new Error(`Failed to create product: ${productError.message}`)

  // اضيف الـ variants
  if (input.variants.length > 0) {
    const { error: variantsError } = await supabase
      .from('product_variants')
      .insert(
        input.variants.map((v) => ({
          product_id: product.id,
          name_ar:    v.nameAr,
          price:      v.price,
          is_default: v.isDefault,
          sort_order: v.sortOrder,
        }))
      )

    if (variantsError) throw new Error(`Failed to create variants: ${variantsError.message}`)
  }

  return product.id
}

// ============================================================
// Update Product
// ============================================================

export type UpdateProductInput = Partial<Omit<CreateProductInput, 'variants'>> & {
  variants?: CreateProductInput['variants']
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput
): Promise<void> {
  const supabase = await createClient()

  const updates: Record<string, unknown> = {}
  if (input.categoryId          !== undefined) updates.category_id           = input.categoryId
  if (input.nameAr              !== undefined) updates.name_ar               = input.nameAr
  if (input.nameEn              !== undefined) updates.name_en               = input.nameEn
  if (input.descriptionAr       !== undefined) updates.description_ar        = input.descriptionAr
  if (input.basePrice           !== undefined) updates.base_price            = input.basePrice
  if (input.pricingUnit         !== undefined) updates.pricing_unit          = input.pricingUnit
  if (input.preparationType     !== undefined) updates.preparation_type      = input.preparationType
  if (input.prepDurationMinutes !== undefined) updates.prep_duration_minutes = input.prepDurationMinutes
  if (input.allowsTextOnCake    !== undefined) updates.allows_text_on_cake   = input.allowsTextOnCake
  if (input.isFeatured          !== undefined) updates.is_featured           = input.isFeatured
  if (input.sortOrder           !== undefined) updates.sort_order            = input.sortOrder
  if (input.imageUrl            !== undefined) updates.images                = [input.imageUrl]

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)

    if (error) throw new Error(`Failed to update product: ${error.message}`)
  }

  // لو في variants جديدة: امسح القديمة واعمل الجديدة
  if (input.variants) {
    await supabase.from('product_variants').delete().eq('product_id', productId)

    const { error } = await supabase
      .from('product_variants')
      .insert(
        input.variants.map((v) => ({
          product_id: productId,
          name_ar:    v.nameAr,
          price:      v.price,
          is_default: v.isDefault,
          sort_order: v.sortOrder,
        }))
      )

    if (error) throw new Error(`Failed to update variants: ${error.message}`)
  }
}

// ============================================================
// Delete Product — بيمسح المنتج والصورة من الـ Storage
// ============================================================

export async function deleteProduct(productId: string): Promise<void> {
  const supabase = await createClient()

  // امسح الصورة من الـ Storage الأول
  await supabase.storage
    .from('product-images')
    .remove([`products/${productId}.webp`])
  // مش بنعمل throw لو الصورة مش موجودة — المنتج ممكن يكون من غير صورة

  // امسح المنتج (الـ variants بتتمسح تلقائي بسبب ON DELETE CASCADE)
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw new Error(`Failed to delete product: ${error.message}`)
}

// ============================================================
// Best Sellers — من بيانات الطلبات الحقيقية
// ============================================================

export async function getBestSellers(
  limit = 5
): Promise<{ productId: string; nameAr: string; totalSold: number; revenue: number }[]> {
  const supabase = await createClient()

  // بنجمع order_items مع orders عشان نستثني الـ cancelled
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product_name_ar,
      quantity,
      line_total,
      order:orders!inner (status)
    `)
    .not('order.status', 'eq', 'cancelled')

  if (error) throw new Error(`Failed to fetch best sellers: ${error.message}`)

  // Group by product_id في الـ JS
  const map = new Map<string, { nameAr: string; totalSold: number; revenue: number }>()

  for (const item of data) {
    if (!item.product_id) continue
    const existing = map.get(item.product_id)
    if (existing) {
      existing.totalSold += item.quantity
      existing.revenue   += item.line_total
    } else {
      map.set(item.product_id, {
        nameAr:    item.product_name_ar,
        totalSold: item.quantity,
        revenue:   item.line_total,
      })
    }
  }

  return Array.from(map.entries())
    .map(([productId, stats]) => ({ productId, ...stats }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, limit)
}
