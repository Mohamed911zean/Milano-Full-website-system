'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, Calendar, Hash, Loader2 } from 'lucide-react';
import { SectionLabel, GoldDivider } from '@/components/ui/Typography';
import { getUserOrders } from '@/lib/services/orders';
import { OrderWithItems } from '@/lib/supabase/types';
import OrderStatusBadge from '@/components/customer/OrderStatusBadge';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <SectionLabel>سجل المشتريات</SectionLabel>
        <h1 className="text-4xl font-display font-bold text-white">طلباتي</h1>
      </header>

      {orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center text-gold mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">لا توجد طلبات بعد</h3>
            <p className="text-text-muted text-sm font-light">ابدأ رحلتك مع حلويات ميلانو واطلب الآن</p>
          </div>
          <Link href="/products" className="inline-block px-10 py-4 bg-gold text-text-on-gold rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all shadow-gold">
            تصفح المنيو
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl overflow-hidden group hover:border-gold-border transition-all duration-500"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <div className="flex items-center gap-2 text-text-fade text-[10px] font-bold uppercase tracking-widest">
                      <Hash className="w-3.5 h-3.5 text-gold" />
                      <span>{order.order_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-fade text-[10px] font-bold uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                      {order.items.length} منتجات
                    </h3>
                    <p className="text-text-muted text-sm font-light truncate max-w-md">
                      {order.items.map(item => item.product_name_ar).join(' ، ')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-text-fade font-bold block mb-1">الإجمالي</span>
                    <span className="text-2xl font-display font-bold text-gold">{formatPrice(order.total_price)}</span>
                  </div>
                  <Link 
                    href={`/track-order?number=${order.order_number}&phone=${order.customer_phone}`}
                    className="w-12 h-12 rounded-full border border-gold-border/20 flex items-center justify-center text-gold hover:bg-gold hover:text-text-on-gold transition-all duration-500"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
