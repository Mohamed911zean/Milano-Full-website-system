import { createClient } from '@/lib/supabase/server'
import CustomerDetailsClient from './CustomerDetailsClient'

export const dynamic = 'force-dynamic'

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const customerId = params.id

  // Get customer profile
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('id, full_name, email, phone, address, created_at')
    .eq('id', customerId)
    .single()

  if (!profile) {
    return <div className="text-white p-10 text-center">لم يتم العثور على العميل</div>
  }

  // Get customer's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total_price, created_at')
    .eq('user_id', customerId)
    .order('created_at', { ascending: false })

  // Calculate analytics
  const nonCancelledOrders = (orders ?? []).filter(o => o.status !== 'cancelled')
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + Number(o.total_price ?? 0), 0)
  const totalOrders = nonCancelledOrders.length
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const lastOrderDate = nonCancelledOrders.length > 0 ? nonCancelledOrders[0].created_at : null

  // Get wishlist
  const { data: wishlistData } = await supabase
    .from('wishlists')
    .select('product_id, products(id, name_ar, images, base_price)')
    .eq('user_id', customerId)
    .order('created_at', { ascending: false })

  const wishlist = (wishlistData ?? [])
    .map(w => w.products)
    .filter(Boolean) as any[]

  const analytics = {
    total_revenue: totalRevenue,
    total_orders: totalOrders,
    aov: aov,
    wishlist_count: wishlist.length,
    last_order_date: lastOrderDate
  }

  return (
    <CustomerDetailsClient
      profile={profile}
      analytics={analytics}
      orders={orders ?? []}
      wishlist={wishlist}
    />
  )
}
