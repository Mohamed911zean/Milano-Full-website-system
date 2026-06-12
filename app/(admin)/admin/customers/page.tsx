import { createClient } from '@/lib/supabase/server'
import CustomersClient from './CustomersClient'

export const dynamic = 'force-dynamic'

async function getCustomersData() {
  const supabase = await createClient()

  // Get all customer profiles
  const { data: customerProfiles } = await supabase
    .from('customer_profiles')
    .select('id, full_name, email, phone, address, created_at')
    .order('created_at', { ascending: false })

  // Get all non-cancelled orders to calculate customer stats
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total_price, created_at')
    .neq('status', 'cancelled')

  const allCustomers = (customerProfiles ?? []).map(profile => {
    const customerOrders = orders?.filter(o => o.user_id === profile.id) ?? []
    const totalOrders = customerOrders.length
    const totalRevenue = customerOrders.reduce((sum, o) => sum + Number(o.total_price ?? 0), 0)
    const lastOrderDate = customerOrders.length > 0 
      ? customerOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at 
      : null

    return {
      ...profile,
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      last_order_date: lastOrderDate
    }
  })

  const customersWithOrders = allCustomers.filter(c => c.total_orders > 0)
    .sort((a, b) => b.total_revenue - a.total_revenue)

  return { allCustomers, customersWithOrders }
}

export default async function CustomersPage() {
  const data = await getCustomersData()
  return <CustomersClient {...data} />
}
