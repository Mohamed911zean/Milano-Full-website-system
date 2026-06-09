import { createClient } from '@/lib/supabase/server'
import ProductsClientPage from './ClientPage'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    const [
        { data: productsData },
        { data: categoriesData }
    ] = await Promise.all([
        supabase.from('products').select('*, category:categories(*), variants:product_variants(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order')
    ])

    return (
        <ProductsClientPage 
            initialProducts={productsData ?? []} 
            categories={categoriesData ?? []}
        />
    )
}
