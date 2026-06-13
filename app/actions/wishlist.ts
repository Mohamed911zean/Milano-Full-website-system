'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: string, path: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('يجب تسجيل الدخول لإضافة المنتجات للمفضلة');
  }

  // Check if it exists
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // Remove it
    await supabase
      .from('wishlists')
      .delete()
      .eq('id', existing.id);
  } else {
    // Add it
    await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        product_id: productId
      });
  }

  revalidatePath(path);
  return !existing; // Returns true if added, false if removed
}

export async function getWishlistProducts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // ضفنا هنا استخراج الـ error عشان نعرف المشكلة فين
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      product_id,
      products (
        id,
        name_ar,
        name_en,
        description_ar,
        base_price,
        images,
        is_active,
        category:categories(name_ar)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 1. لو فيه مشكلة، هتظهرلك هنا في الكونسول
  if (error) {
    console.error("Error fetching wishlist products:", error.message);
    return [];
  }

  if (!data) return [];

  // 2. تبسيط الفلترة (علاقة المفضلة بالمنتج هي 1-to-1، فالمنتج هيرجع كـ Object مش Array)
  return data
    .map(item => Array.isArray(item.products) ? item.products[0] : item.products)
    // التأكد إن المنتج مش null (بسبب الـ RLS) وإنه is_active
    .filter(product => product && product.is_active === true);
}