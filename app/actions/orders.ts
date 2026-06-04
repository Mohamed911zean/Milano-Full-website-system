"use server"

import { createOrder } from '@/lib/services/orders'
import { CreateOrderSchema, CreateOrderInput } from '@/lib/schemas/order'

export async function submitOrder(formData: CreateOrderInput) {
  // 1. Validate with Zod
  const parsed = CreateOrderSchema.safeParse(formData)
  
  if (!parsed.success) {
    return { 
      success: false, 
      errors: parsed.error.flatten().fieldErrors 
    }
  }

  try {
    // 2. Create order
    const order = await createOrder(parsed.data)
    return { 
      success: true, 
      orderNumber: order.order_number 
    }
  } catch (error: unknown) {
    console.error('Order submission error:', error)
    return { 
      success: false, 
      message: 'فشل تأكيد الطلب، برجاء المحاولة مرة أخرى.' 
    }
  }
}
