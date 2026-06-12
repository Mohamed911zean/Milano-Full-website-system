'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag, Heart,
  ArrowRight
} from 'lucide-react'

interface CustomerProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  created_at: string
}

interface CustomerAnalytics {
  total_revenue: number
  total_orders: number
  aov: number
  wishlist_count: number
  last_order_date: string | null
}

interface Order {
  id: string
  order_number: string
  status: string
  total_price: number
  created_at: string
}

interface WishlistedProduct {
  id: string
  name_ar: string | null
  images: string[] | null
  base_price: number
}

interface Props {
  profile: CustomerProfile
  analytics: CustomerAnalytics
  orders: Order[]
  wishlist: WishlistedProduct[]
}

const STATUS_LABELS: Record<string, string> = {
  new: 'جديد', confirmed: 'مؤكد', in_preparation: 'يُحضَّر', ready: 'جاهز',
  out_for_delivery: 'في الطريق', delivered: 'تم التوصيل', picked_up: 'استُلم', cancelled: 'ملغى'
}

export default function CustomerDetailsClient({ profile, analytics, orders, wishlist }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="w-10 h-10 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 flex items-center justify-center transition-all duration-200"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">تفاصيل العميل</h1>
          <p className="text-white/40 text-sm mt-1">{profile.full_name ?? 'غير متاح'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Analytics */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Info */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#c9a84c] mb-4">معلومات العميل</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em]">الاسم</p>
                  <p className="text-white font-semibold">{profile.full_name ?? 'غير متاح'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em]">البريد الإلكتروني</p>
                  <p className="text-white font-semibold">{profile.email ?? 'غير متاح'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em]">الهاتف</p>
                  <p className="text-white font-semibold">{profile.phone ?? 'غير متاح'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em]">العنوان</p>
                  <p className="text-white font-semibold text-sm">{profile.address ?? 'غير متاح'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em]">تاريخ التسجيل</p>
                  <p className="text-white font-semibold text-sm">{new Date(profile.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#c9a84c] mb-4">تحليلات العميل</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em] mb-1">إجمالي الإيرادات</p>
                <p className="text-[#c9a84c] text-xl font-bold">{analytics.total_revenue.toLocaleString('ar-EG')} ج</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em] mb-1">إجمالي الطلبات</p>
                <p className="text-white text-xl font-bold">{analytics.total_orders}</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em] mb-1">متوسط قيمة الطلب</p>
                <p className="text-white text-xl font-bold">{analytics.aov.toLocaleString('ar-EG')} ج</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em] mb-1">عدد المفضلة</p>
                <p className="text-white text-xl font-bold">{analytics.wishlist_count}</p>
              </div>
            </div>
            {analytics.last_order_date && (
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.15em] mb-1">تاريخ آخر طلب</p>
                <p className="text-white font-semibold text-sm">{new Date(analytics.last_order_date).toLocaleDateString('ar-EG')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Orders & Wishlist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order History */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#c9a84c] mb-4">تاريخ الطلبات</h2>
            {orders.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingBag className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">لا يوجد طلبات لهذا العميل</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between bg-white/[0.02] rounded-xl p-4 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-white font-bold">#{order.order_number}</div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.12em] ${
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-[#c9a84c]/10 text-[#c9a84c]'
                      }`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[#c9a84c] font-bold">{order.total_price.toLocaleString('ar-EG')} ج</span>
                      <span className="text-white/40 text-sm">{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                      <Link
                        href={`/admin/orders`}
                        className="text-white/40 hover:text-white text-sm"
                      >
                        عرض
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#c9a84c] mb-4">المنتجات المفضلة</h2>
            {wishlist.length === 0 ? (
              <div className="py-10 text-center">
                <Heart className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">لا يوجد منتجات في المفضلة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {wishlist.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white/[0.02] rounded-xl overflow-hidden border border-white/[0.04]"
                  >
                    {product.images && product.images[0] && (
                      <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-white/0">
                        {/* Placeholder for image */}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-1">{product.name_ar ?? 'غير متاح'}</h3>
                      <p className="text-[#c9a84c] font-bold">{product.base_price.toLocaleString('ar-EG')} ج</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
