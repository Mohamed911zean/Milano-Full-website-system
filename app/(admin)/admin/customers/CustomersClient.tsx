'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, User, Calendar, DollarSign, ShoppingBag, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Customer {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  created_at: string
  total_orders: number
  total_revenue: number
  last_order_date: string | null
}

interface Props {
  allCustomers: Customer[]
  customersWithOrders: Customer[]
}

export default function CustomersClient({ allCustomers, customersWithOrders }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'with_orders'>('all')

  const currentData = activeTab === 'all' ? allCustomers : customersWithOrders

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">العملاء</h1>
          <p className="text-white/40 text-sm mt-1">إدارة وعرض معلومات العملاء</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#111113] border border-white/[0.06] rounded-2xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            "px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200",
            activeTab === 'all'
              ? "bg-[#c9a84c] text-[#0d0d0f] shadow-lg shadow-[#c9a84c]/20"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          )}
        >
          جميع العملاء المسجلين
        </button>
        <button
          onClick={() => setActiveTab('with_orders')}
          className={cn(
            "px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200",
            activeTab === 'with_orders'
              ? "bg-[#c9a84c] text-[#0d0d0f] shadow-lg shadow-[#c9a84c]/20"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          )}
        >
          العملاء لديهم طلبات
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02]">
              <tr className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em]">
                <th className="text-right px-5 py-4">الاسم</th>
                <th className="text-right px-5 py-4">البريد الإلكتروني</th>
                <th className="text-right px-5 py-4">الهاتف</th>
                <th className="text-right px-5 py-4">إجمالي الطلبات</th>
                <th className="text-right px-5 py-4">إجمالي الإيرادات</th>
                <th className="text-right px-5 py-4">تاريخ آخر طلب</th>
                <th className="text-left px-5 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {currentData.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 flex items-center justify-center text-[#c9a84c] font-bold text-sm">
                        {customer.full_name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {customer.full_name ?? 'غير متاح'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">
                    {customer.email ?? 'غير متاح'}
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">
                    {customer.phone ?? 'غير متاح'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white font-bold text-sm">
                      {customer.total_orders}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[#c9a84c] font-bold text-sm">
                      {customer.total_revenue.toLocaleString('ar-EG')} ج
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/50 text-sm">
                    {customer.last_order_date 
                      ? new Date(customer.last_order_date).toLocaleDateString('ar-EG') 
                      : 'لا يوجد'}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="w-8 h-8 rounded-lg border border-white/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] text-white/40 hover:bg-[#c9a84c]/5 flex items-center justify-center transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentData.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 text-sm">لا يوجد عملاء بعد</p>
          </div>
        )}
      </div>
    </div>
  )
}
