// lib/schemas/order.ts
// واحدة schema بتستخدمها في 3 أماكن:
// 1. Client form validation
// 2. Server Action validation
// 3. TypeScript types

import { z } from 'zod'

export const CartItemSchema = z.object({
  productId:     z.string().uuid(),
  variantId:     z.string().uuid(),
  productNameAr: z.string().min(1),
  variantNameAr: z.string().optional(),
  unitPrice:     z.number().positive(),
  quantity:      z.number().int().positive().max(99),
  cakeText:      z.string().max(100).optional(),
})

export const CreateOrderSchema = z.object({
  customerName:    z.string().min(2, 'الاسم مطلوب'),
  customerPhone:   z.string().regex(/^01[0-9]{9}$/, 'رقم تليفون مش صح'),
  fulfillmentType: z.enum(['delivery', 'pickup']),

  // موقع التوصيل — مطلوب لو delivery
  deliveryAddress: z.string().optional(),
  locationLat:     z.number().optional(),
  locationLng:     z.number().optional(),
  locationNote:    z.string().max(200).optional(),

  customerNotes:   z.string().max(500).optional(),
  items:           z.array(CartItemSchema).min(1, 'السلة فاضية'),
}).superRefine((data, ctx) => {
  if (
    data.fulfillmentType === 'delivery' &&
    !data.deliveryAddress &&
    !data.locationLat
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'محتاج تحدد العنوان أو الموقع على الخريطة',
      path: ['deliveryAddress'],
    })
  }
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type CartItemInput = z.infer<typeof CartItemSchema>
