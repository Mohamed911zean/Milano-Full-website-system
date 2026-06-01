// lib/services/orders.ts
// كل logic خاصة بالطلبات بتمشي من هنا

import { createClient } from '@/lib/supabase/server'
import type { Order, OrderWithItems, OrderStatus } from '@/lib/supabase/types'
import type { CreateOrderInput } from '@/lib/schemas/order'

// ============================================================
// Customer: إنشاء طلب جديد
// ============================================================

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = await createClient()

  // جيب الـ user_id لو authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // احسب الـ subtotal
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  // جيب delivery fee من الـ config
  const { data: configData } = await supabase
    .from('shop_config')
    .select('value')
    .eq('key', 'delivery_fee')
    .single()

  const deliveryFee =
    input.fulfillmentType === 'delivery'
      ? (configData?.value as number) ?? 0
      : 0

  // اعمل الـ order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name:    input.customerName,
      customer_phone:   input.customerPhone,
      delivery_address: input.deliveryAddress ?? null,
      location_lat:     input.locationLat ?? null,
      location_lng:     input.locationLng ?? null,
      location_note:    input.locationNote ?? null,
      fulfillment_type: input.fulfillmentType,
      subtotal,
      delivery_fee:     deliveryFee,
      customer_notes:   input.customerNotes ?? null,
      user_id:          user?.id || null, // Link to user if logged in
    })
    .select()
    .single()

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`)

  // اعمل الـ order items
  const orderItems = input.items.map((item) => ({
    order_id:        order.id,
    product_id:      item.productId,
    variant_id:      item.variantId,
    product_name_ar: item.productNameAr,
    variant_name_ar: item.variantNameAr ?? null,
    unit_price:      item.unitPrice,
    quantity:        item.quantity,
    cake_text:       item.cakeText ?? null,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`)

  return order
}

// ============================================================
// Customer: جلب طلبات المستخدم
// ============================================================

export async function getUserOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch user orders: ${error.message}`)
  return data as OrderWithItems[]
}

// ============================================================
// Customer: تتبع الطلب
// ============================================================

export async function getOrderByNumberAndPhone(
  orderNumber: string,
  customerPhone: string
): Promise<OrderWithItems | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (*)
    `)
    .eq('order_number', orderNumber)
    .eq('customer_phone', customerPhone)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch order: ${error.message}`)
  }

  return data as OrderWithItems
}

// ============================================================
// Dashboard: جلب الطلبات (للموظف والأونر)
// ============================================================

export interface GetOrdersOptions {
  status?: OrderStatus | OrderStatus[]
  from?: string
  to?: string
  assignedTo?: string
  limit?: number
  offset?: number
}

export async function getOrders(
  options: GetOrdersOptions = {}
): Promise<{ orders: OrderWithItems[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items (*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (options.status) {
    const statuses = Array.isArray(options.status)
      ? options.status
      : [options.status]
    query = query.in('status', statuses)
  }

  if (options.from) query = query.gte('created_at', options.from)
  if (options.to)   query = query.lte('created_at', options.to)
  if (options.assignedTo) query = query.eq('assigned_to', options.assignedTo)
  if (options.limit)  query = query.limit(options.limit)
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1)

  const { data, error, count } = await query

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)
  return { orders: data as OrderWithItems[], count: count ?? 0 }
}

// ============================================================
// Dashboard: تغيير status الطلب
// ============================================================

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  staffId: string
): Promise<void> {
  const supabase = await createClient()

  const updates: Partial<Order> = {
    status,
    ...(status === 'confirmed'  && { confirmed_at: new Date().toISOString() }),
    ...(status === 'delivered'  && { delivered_at: new Date().toISOString() }),
    ...(status === 'picked_up'  && { delivered_at: new Date().toISOString() }),
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)

  if (error) throw new Error(`Failed to update order status: ${error.message}`)
}

export async function addStaffNote(
  orderId: string,
  note: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ staff_notes: note })
    .eq('id', orderId)

  if (error) throw new Error(`Failed to add staff note: ${error.message}`)
}

// ============================================================
// Analytics (Owner only)
// ============================================================

export async function getOrderStats(from: string, to: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('status, total_price, created_at')
    .gte('created_at', from)
    .lte('created_at', to)
    .not('status', 'eq', 'cancelled')

  if (error) throw new Error(`Failed to fetch stats: ${error.message}`)

  const totalOrders   = data.length
  const totalRevenue  = data.reduce((sum, o) => sum + (o.total_price ?? 0), 0)
  const delivered     = data.filter(o => ['delivered','picked_up'].includes(o.status)).length

  return { totalOrders, totalRevenue, delivered }
}
