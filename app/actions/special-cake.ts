"use server"

import { createClient } from '@/lib/supabase/server'

export interface SpecialCakeInput {
    customerPhone: string
    occasion:      string
    cakeSize:      string
    flavor:        string
    colorTheme?:   string
    cakeMessage?:  string
    deliveryDate:  string  // YYYY-MM-DD
}

export async function submitSpecialCakeOrder(input: SpecialCakeInput): Promise<{
    success: boolean
    message?: string
}> {
    // Validation
    if (!/^01[0-9]{9}$/.test(input.customerPhone)) {
        return { success: false, message: 'رقم التليفون غير صحيح' }
    }
    if (!input.occasion || !input.cakeSize || !input.flavor || !input.deliveryDate) {
        return { success: false, message: 'برجاء إكمال جميع البيانات المطلوبة' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('special_cake_orders')
        .insert({
            customer_phone: input.customerPhone,
            user_id:        user?.id ?? null,
            occasion:       input.occasion,
            cake_size:      input.cakeSize,
            flavor:         input.flavor,
            color_theme:    input.colorTheme  ?? null,
            cake_message:   input.cakeMessage ?? null,
            delivery_date:  input.deliveryDate,
            status:         'new',
        })

    if (error) {
        console.error('Special cake order error:', error)
        return { success: false, message: 'حصل خطأ، حاول تاني' }
    }

    return { success: true }
}