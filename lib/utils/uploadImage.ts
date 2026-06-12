import { createClient } from '@/lib/supabase/client'

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

  const supabase = createClient()

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
export async function compressImage(
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
