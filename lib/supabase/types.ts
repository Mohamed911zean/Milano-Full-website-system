// lib/supabase/types.ts
// هذا الملف بيتوصف structure الـ database كاملة
// في المشروع الحقيقي بيتولد أوتوماتيك بـ: supabase gen types typescript

export type PreparationType = 'ready_made' | 'made_to_order'
export type PricingUnit = 'per_item' | 'per_dozen' | 'per_kg' | 'per_box'
export type FulfillmentType = 'delivery' | 'pickup'
export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'in_preparation'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'picked_up'
  | 'cancelled'
export type StaffRole = 'owner' | 'operations'

// ============================================================
// Database row types (ما بيجي من الـ DB)
// ============================================================

export interface Category {
  id: string
  name_ar: string
  name_en: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name_ar: string
  name_en: string | null
  description_ar: string | null
  base_price: number
  pricing_unit: PricingUnit
  images: string[]
  preparation_type: PreparationType
  prep_duration_minutes: number | null
  allows_text_on_cake: boolean
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name_ar: string
  price: number
  is_default: boolean
  sort_order: number
  is_active: boolean
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  delivery_address: string | null
  location_lat: number | null
  location_lng: number | null
  location_note: string | null
  fulfillment_type: FulfillmentType
  status: OrderStatus
  subtotal: number
  delivery_fee: number
  total_price: number        // computed
  customer_notes: string | null
  staff_notes: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
  confirmed_at: string | null
  delivered_at: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name_ar: string
  variant_name_ar: string | null
  unit_price: number
  quantity: number
  line_total: number         // computed
  cake_text: string | null
  created_at: string
}

export interface StaffProfile {
  id: string
  full_name: string
  role: StaffRole
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface ShopConfig {
  key: string
  value: unknown
  updated_at: string
  updated_by: string | null
}

// ============================================================
// Joined types (للـ queries اللي بتجيب related data)
// ============================================================

export interface ProductWithCategory extends Product {
  category: Category
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[]
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
  assigned_staff?: Pick<StaffProfile, 'id' | 'full_name'> | null
}

// ============================================================
// Cart types (client-side فقط، مش في الـ DB)
// ============================================================

export interface CartItem {
  productId: string
  variantId: string
  productNameAr: string
  variantNameAr: string
  unitPrice: number
  quantity: number
  cakeText?: string
}

// ============================================================
// Shop config typed values
// ============================================================

export interface BusinessHours {
  [day: string]: { open: string; close: string }
}

export interface ShopConfigValues {
  shop_name: string
  shop_phone: string
  whatsapp_number: string
  delivery_fee: number
  min_order_amount: number
  business_hours: BusinessHours
  announcement_banner: string | null
  address: string
}
