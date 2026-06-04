// ❌ لا يوجد 'use client' هنا — ده Server Component
import { getUserOrders } from '@/lib/services/orders';
import OrdersClient from './client';

export default async function OrdersPage() {
  const orders = await getUserOrders();
  return <OrdersClient orders={orders} />;
}