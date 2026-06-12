import { createClient } from '@/lib/supabase/server'
import CustomersClient from './CustomersClient'

export const dynamic = 'force-dynamic'

async function getCustomersData() {
  const supabase = await createClient()

  // =========================
  // Customer Profiles
  // =========================
  const {
  data: customerProfiles,
  error: profileError
} = await supabase
  .from('customer_profiles')
  .select('*')
  .order('created_at', { ascending: false })
console.log('PROFILE ERROR:', profileError)
console.log('PROFILE DATA:', customerProfiles)
    

  if (profileError) {
    console.error('CUSTOMER PROFILES ERROR:', profileError)

    throw new Error(
      `Failed to fetch customer profiles: ${profileError.message}`
    )
  }

  // =========================
  // Orders
  // =========================
  const {
    data: orders,
    error: ordersError
  } = await supabase
    .from('orders')
    .select('user_id, total_price, created_at, status')
    .neq('status', 'cancelled')

  if (ordersError) {
    console.error('ORDERS ERROR:', ordersError)

    throw new Error(
      `Failed to fetch orders: ${ordersError.message}`
    )
  }

  // =========================
  // Debug Logs
  // =========================
  console.log('====================')
  console.log('CUSTOMER PROFILES:', customerProfiles?.length ?? 0)
  console.log('ORDERS:', orders?.length ?? 0)

  if (customerProfiles?.length) {
    console.log('FIRST CUSTOMER:', customerProfiles[0])
  }

  if (orders?.length) {
    console.log('FIRST ORDER:', orders[0])
  }

  console.log('====================')

  // =========================
  // Analytics
  // =========================
  const allCustomers = (customerProfiles ?? []).map(profile => {
    const customerOrders =
      orders?.filter(order => order.user_id === profile.id) ?? []

    const totalOrders = customerOrders.length

    const totalRevenue = customerOrders.reduce(
      (sum, order) => sum + Number(order.total_price ?? 0),
      0
    )

    const lastOrderDate =
      customerOrders.length > 0
        ? customerOrders.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )[0].created_at
        : null

    return {
      ...profile,
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      last_order_date: lastOrderDate
    }
  })

  const customersWithOrders = allCustomers
    .filter(customer => customer.total_orders > 0)
    .sort((a, b) => b.total_revenue - a.total_revenue)

  console.log('ALL CUSTOMERS:', allCustomers.length)
  console.log('CUSTOMERS WITH ORDERS:', customersWithOrders.length)

  if (
    allCustomers.length > 0 &&
    customersWithOrders.length === 0
  ) {
    console.warn(
      'WARNING: Customers exist but none are matching orders. Check orders.user_id and customer_profiles.id relationship.'
    )
  }

  return {
    allCustomers,
    customersWithOrders
  }
}

export default async function CustomersPage() {
  try {
    const data = await getCustomersData()

    return <CustomersClient {...data} />
  } catch (error) {
    console.error(error)

    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
          <h2 className="text-red-400 font-bold mb-2">
            Failed to load customers
          </h2>

          <pre className="text-sm text-red-300 whitespace-pre-wrap">
            {error instanceof Error
              ? error.message
              : 'Unknown error'}
          </pre>
        </div>
      </div>
    )
  }
}