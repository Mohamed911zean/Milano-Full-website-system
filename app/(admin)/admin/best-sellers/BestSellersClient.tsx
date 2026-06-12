'use client'

import React, { useState , useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Filter, Calendar, ChevronDown, ChevronRight, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BestSellerProduct {
    id: string
    name_ar: string | null
    name_en: string | null
    base_price: number
    category_name_ar: string | null
    total_quantity_sold: number
    total_revenue: number
    total_orders: number
}

interface BestSellersClientProps {
    allProducts: BestSellerProduct[]
    categories: { id: string, name_ar: string | null }[]
}

export default function BestSellersClient({ allProducts, categories }: BestSellersClientProps) {
    const [dateRange, setDateRange] = useState<'today' | 'last7' | 'last30' | 'last90' | 'all'>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

    // Note: For now, we'll filter on client (all data; later we can do server-side filtering-- old commit
const filteredProducts = useMemo(() => {
  if (categoryFilter === 'all') return allProducts
  const selectedCat = categories.find(c => c.id === categoryFilter)
  if (!selectedCat) return allProducts
  return allProducts.filter(p => p.category_name_ar === selectedCat.name_ar)
}, [allProducts, categoryFilter, categories])


    const getDateRangeOptions = [
        { id: 'today', label: 'اليوم' },
        { id: 'last7', label: 'آخر 7 أيام' },
        { id: 'last30', label: 'آخر 30 يوم' },
        { id: 'last90', label: 'آخر 90 يوم' },
        { id: 'all', label: 'كل الوقت' }
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">الأكثر مبيعاً</h1>
                    <p className="text-white/40 text-sm mt-1">عرض المنتجات الأكثر طلباً</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Date Filter */}
                <div className="relative">
                    <button
                        onClick={() => {}}
                        className="h-11 px-4 flex items-center gap-2 rounded-xl border text-sm font-bold bg-[#111113] border-white/[0.06] text-white/70"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>{getDateRangeOptions.find(o => o.id === dateRange)?.label}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="h-11 px-4 flex items-center gap-2 rounded-xl border text-sm font-bold transition-all"
                        style={{
                            backgroundColor: categoryFilter !== 'all' ? 'rgba(201,168,76,0.1)' : '#111113',
                            borderColor: categoryFilter !== 'all' ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)',
                            color: categoryFilter !== 'all' ? '#c9a84c' : 'rgba(255,255,255,0.7)'
                        }}
                    >
                        <Filter className="w-4 h-4" />
                        <span>{categoryFilter === 'all' ? 'كل الفئات' : categories.find(c => c.id === categoryFilter)?.name_ar ?? 'كل الفئات'}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showCategoryDropdown && "rotate-180")} />
                    </button>
                    {showCategoryDropdown && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                            <div className="absolute left-0 top-14 z-20 bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl p-2 min-w-[180px]">
                                <button
                                    key="all"
                                    onClick={() => { setCategoryFilter('all'); setShowCategoryDropdown(false) }}
                                    className={cn("w-full text-right px-3 py-2 rounded-xl text-sm transition-all", categoryFilter === 'all' ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-white/50 hover:text-white hover:bg-white/5")}
                                >
                                    كل الفئات
                                </button>
                                {categories.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => { setCategoryFilter(c.id); setShowCategoryDropdown(false) }}
                                        className={cn("w-full text-right px-3 py-2 rounded-xl text-sm transition-all", categoryFilter === c.id ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-white/50 hover:text-white hover:bg-white/5")}
                                    >
                                        {c.name_ar ?? c.id}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/[0.02]">
                            <tr className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="text-right px-5 py-3">المنتج</th>
                                <th className="text-right px-5 py-3">الفئة</th>
                                <th className="text-right px-5 py-3 text-center">الكمية المباعة</th>
                                <th className="text-right px-5 py-3">الإيرادات</th>
                                <th className="text-right px-5 py-3 text-center">عدد الطلبات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-white/20 text-sm">
                                        لا توجد بيانات
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, i) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c]/15 to-[#c9a84c]/5 flex items-center justify-center text-[#c9a84c] font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="text-white font-semibold text-sm">
                                                    {product.name_ar ?? product.name_en ?? product.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-white/60 text-sm">
                                            {product.category_name_ar ?? 'غير مصنف'}
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="text-white font-bold text-sm flex items-center justify-center gap-1">
                                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                {product.total_quantity_sold}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[#c9a84c] font-bold text-sm">
                                                {product.total_revenue.toLocaleString('ar-EG')} ج
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center text-white/80 text-sm font-semibold">
                                            {product.total_orders}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
