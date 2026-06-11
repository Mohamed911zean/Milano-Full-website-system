import { createClient } from '@/lib/supabase/server'
import LiveOrdersClient from './LiveOrdersClient'

export const dynamic = 'force-dynamic'

export default async function AdminLiveOrdersPage() {
    const supabase = await createClient()

    // Fetch initial recent orders
    const { data: initialOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    return <LiveOrdersClient initialOrders={initialOrders ?? []} />
}
