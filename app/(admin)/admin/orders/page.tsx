import { createClient } from '@/lib/supabase/server'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getOrdersData(page: number) {
    const supabase = await createClient()
    const pageSize = 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: orders, count } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, customer_phone, customer_email, status, total_price, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    return { orders: orders ?? [], totalPages: Math.ceil((count ?? 0) / pageSize) }
}

export default async function AdminOrdersPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const page = parseInt(searchParams.page ?? '1', 10)
    const { orders, totalPages } = await getOrdersData(page)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">إدارة الطلبات</h2>
                    <p className="text-xs text-white/40 mt-0.5">مراجعة أحدث 50 طلب في النظام</p>
                </div>
            </div>

            <OrdersTable orders={orders} currentPage={page} totalPages={totalPages} />
        </div>
    )
}
