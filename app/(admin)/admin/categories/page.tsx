import { createClient } from '@/lib/supabase/server'
import CategoriesClient from './CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select(`
            *,
            products:products(count)
        `)
        .order('sort_order')

    // Format products count
    const formattedCategories = (categories ?? []).map(c => ({
        ...c,
        productsCount: c.products?.[0]?.count ?? 0
    }))

    return <CategoriesClient initialCategories={formattedCategories} />
}
