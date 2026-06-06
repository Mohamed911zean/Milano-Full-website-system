"use server"

import { createClient } from '@/lib/supabase/server'
import { createOrder } from '@/lib/services/orders'

interface CartItem {
  productId:     string
  variantId?:    string
  productNameAr: string
  variantNameAr?: string
  unitPrice:     number
  quantity:      number
  cakeText?:     string
}

interface OrderInput {
  customerName:    string
  customerPhone:   string
  fulfillmentType: 'delivery' | 'pickup'
  deliveryAddress?: string
  customerNotes?:  string
  items:           CartItem[]
}

function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export async function submitOrder(input: OrderInput) {
  // Validate phone
  if (!/^01[0-9]{9}$/.test(input.customerPhone)) {
    return { success: false, message: 'رقم التليفون غير صحيح — لازم يبدأ بـ 01 ويكون 11 رقم' }
  }

  if (!input.customerName?.trim()) {
    return { success: false, message: 'الاسم مطلوب' }
  }

  if (input.fulfillmentType === 'delivery' && !input.deliveryAddress?.trim()) {
    return { success: false, message: 'عنوان التوصيل مطلوب' }
  }

  if (!input.items?.length) {
    return { success: false, message: 'السلة فاضية' }
  }

  const supabase = await createClient()

  // احسب الـ subtotal
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  )

  // جيب delivery fee
  const { data: configData } = await supabase
    .from('shop_config')
    .select('value')
    .eq('key', 'delivery_fee')
    .single()

  const deliveryFee = input.fulfillmentType === 'delivery'
    ? Number(configData?.value ?? 50)
    : 0

  // جيب الـ user
  const { data: { user } } = await supabase.auth.getUser()

  // اعمل الـ order — order_number بيتولد من الـ trigger
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id:          user?.id ?? null,
      customer_name:    input.customerName.trim(),
      customer_phone:   input.customerPhone,
      delivery_address: input.deliveryAddress?.trim() ?? null,
      fulfillment_type: input.fulfillmentType,
      subtotal,
      delivery_fee:     deliveryFee,
      customer_notes:   input.customerNotes?.trim() ?? null,
    })
    .select('id, order_number')
    .single()

  if (orderError) {
    console.error('Order insert error:', orderError)
    return { success: false, message: `فشل إنشاء الطلب: ${orderError.message}` }
  }

  // اعمل الـ order items
  const orderItems = input.items.map(item => ({
    order_id:        order.id,
    // لو الـ id مش UUID، ابعت null عشان مش UUID FK
    product_id:      isUUID(item.productId) ? item.productId : null,
    variant_id:      item.variantId && isUUID(item.variantId) ? item.variantId : null,
    product_name_ar: item.productNameAr,
    variant_name_ar: item.variantNameAr ?? null,
    unit_price:      item.unitPrice,
    quantity:        item.quantity,
    cake_text:       item.cakeText ?? null,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    // الأوردر اتعمل بس الـ items فشلت — امسح الأوردر
    await supabase.from('orders').delete().eq('id', order.id)
    return { success: false, message: `فشل حفظ المنتجات: ${itemsError.message}` }
  }

  return { success: true, orderNumber: order.order_number }
}