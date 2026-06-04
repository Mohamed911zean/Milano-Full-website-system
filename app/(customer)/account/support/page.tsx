// ❌ لا يوجد 'use client' هنا — ده Server Component
import { getUserTickets } from '@/lib/services/support';
import { getUserOrders } from '@/lib/services/orders';
import SupportClient from './client';

export default async function SupportPage() {
  const [tickets, orders] = await Promise.all([
    getUserTickets(),
    getUserOrders(),
  ]);

  return <SupportClient initialTickets={tickets} orders={orders} />;
}