import { createClient } from '@/lib/supabase/server'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getOrdersData() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, customer_phone, status, total_price, created_at')
        .order('created_at', { ascending: false })
        .limit(50) // Showing recent 50 for now, could add pagination

    return orders ?? []
}

export default async function AdminOrdersPage() {
    const orders = await getOrdersData()

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

            <OrdersTable orders={orders} />
        </div>
    )
}
