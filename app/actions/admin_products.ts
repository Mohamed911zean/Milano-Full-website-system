'use server'

import { createClient } from '@/lib/supabase/server'
import {
    createProduct as createProductService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
    toggleProductActive as toggleProductActiveService,
    type CreateProductInput,
    type UpdateProductInput
} from '@/lib/services/products'

async function requireSuperAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('غير مصرح')

    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

    if (!staff || !staff.is_active || !['owner', 'super_admin'].includes(staff.role)) {
        throw new Error('صلاحيات غير كافية')
    }

    return { supabase, user, staff }
}

export async function adminCreateProduct(input: CreateProductInput) {
    try {
        const { user } = await requireSuperAdmin()
        const productId = await createProductService(input)

        const supabase = await createClient()
        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `أضاف منتج جديد: ${input.nameAr}`,
            target_type: 'product',
            target_id: productId,
        })

        return { success: true, productId }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

export async function adminUpdateProduct(productId: string, input: UpdateProductInput) {
    try {
        const { user } = await requireSuperAdmin()
        await updateProductService(productId, input)

        const supabase = await createClient()
        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `عدّل بيانات منتج: ${input.nameAr ?? productId}`,
            target_type: 'product',
            target_id: productId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

export async function adminDeleteProduct(productId: string, productName: string) {
    try {
        const { user } = await requireSuperAdmin()
        await deleteProductService(productId)

        const supabase = await createClient()
        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: `حذف منتج: ${productName}`,
            target_type: 'product',
            target_id: productId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}

export async function adminToggleProductActive(productId: string, isActive: boolean, productName: string) {
    try {
        const { user } = await requireSuperAdmin()
        await toggleProductActiveService(productId, isActive)

        const supabase = await createClient()
        await supabase.from('staff_activity_log').insert({
            staff_id: user.id,
            action: isActive ? `فعّل منتج: ${productName}` : `أوقف منتج: ${productName}`,
            target_type: 'product',
            target_id: productId,
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'خطأ غير متوقع' }
    }
}
