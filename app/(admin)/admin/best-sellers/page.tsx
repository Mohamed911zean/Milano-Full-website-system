import { createClient } from '@/lib/supabase/server'
import BestSellersClient from './BestSellersClient'

export const dynamic = 'force-dynamic'

async function getBestSellersData() {
    const supabase = await createClient()

    // Get categories
    const { data: categories } = await supabase.from('categories').select('id, name_ar')

    // Get all non-cancelled orders and their items
    // First, get all non-cancelled orders
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status')
        .neq('status', 'cancelled')

    if (!orders || orders.length === 0) {
        return {
            allProducts: [],
            categories: categories ?? []
        }
    }

    // Get order items for those orders
    const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, product_name_ar, unit_price, quantity')
        .in('order_id', orders.map(o => o.id))

    if (!orderItems || orderItems.length === 0) {
        return {
            allProducts: [],
            categories: categories ?? []
        }
    }

    // Aggregate by product
    const productMap = new Map<string, {
        id: string, name_ar: string | null, base_price: number, category_id: string | null,
        total_quantity_sold: number, total_revenue: number, order_ids: Set<string>
    }>()

    // Now get all products to get details and categories
    const productIds = [...new Set(orderItems.map(oi => oi.product_id).filter(Boolean))]
    const { data: productsData } = await supabase
        .from('products')
        .select('id, name_ar, name_en, base_price, category_id, categories(name_ar)')
        .in('id', productIds as string[])

    const productsById = new Map<string, any>()
    productsData?.forEach(p => { productsById.set(p.id, p) })

    orderItems.forEach(item => {
        if (!item.product_id) return

        const existing = productMap.get(item.product_id)
        const product = productsById.get(item.product_id)
        if (!existing && product) {
            productMap.set(item.product_id, {
                id: item.product_id,
                name_ar: product.name_ar ?? item.product_name_ar,
                base_price: product.base_price ?? item.unit_price,
                category_id: product.category_id ?? null,
                total_quantity_sold: item.quantity,
                total_revenue: item.unit_price * item.quantity,
                order_ids: new Set([item.id])
            })
        } else if (existing) {
            existing.total_quantity_sold += item.quantity
            existing.total_revenue += item.unit_price * item.quantity
            existing.order_ids.add(item.id)
        }
    })

    // Convert map to array and sort by quantity sold descending
    let allProducts = Array.from(productMap.values()).map(p => ({
        ...p,
        total_orders: p.order_ids.size,
        category_name_ar: productsById.get(p.id)?.categories?.name_ar ?? null
    })).sort((a, b) => b.total_quantity_sold - a.total_quantity_sold)

    return {
        allProducts,
        categories: categories ?? []
    }
}

export default async function AdminBestSellersPage() {
    const { allProducts, categories } = await getBestSellersData()
    return <BestSellersClient allProducts={allProducts} categories={categories} />
}
