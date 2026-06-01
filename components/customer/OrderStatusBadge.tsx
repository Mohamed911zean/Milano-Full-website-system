'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/lib/supabase/types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: 'جديد', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  confirmed: { label: 'تم التأكيد', className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  in_preparation: { label: 'قيد التحضير', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  ready: { label: 'جاهز للاستلام', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  out_for_delivery: { label: 'في الطريق', className: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  delivered: { label: 'تم التوصيل', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  picked_up: { label: 'تم الاستلام', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  cancelled: { label: 'ملغي', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
      config.className
    )}>
      {config.label}
    </span>
  );
}
