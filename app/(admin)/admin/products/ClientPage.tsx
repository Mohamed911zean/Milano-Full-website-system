'use client'

import { useState, useMemo, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Edit, Trash2, Package, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminDeleteProduct, adminToggleProductActive } from '@/app/actions/admin_products'
import { ProductFormModal } from '@/components/admin/ProductFormModal'
import type { Category, ProductWithVariants } from '@/lib/supabase/types'

export default function ProductsClientPage({ 
    initialProducts, 
    categories 
}: { 
    initialProducts: (ProductWithVariants & { category: Category | null })[]
    categories: Category[] 
}) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all') // 'all', 'active', 'inactive'
    
    // Modal states
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductWithVariants | undefined>(undefined)
    
    // Action states
    const [isPending, startTransition] = useTransition()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(p => {
            const matchSearch = p.name_ar.toLowerCase().includes(search.toLowerCase()) || 
                                (p.name_en?.toLowerCase().includes(search.toLowerCase()))
            const matchCat = categoryFilter === 'all' || p.category_id === categoryFilter
            const matchStatus = statusFilter === 'all' || 
                               (statusFilter === 'active' && p.is_active) || 
                               (statusFilter === 'inactive' && !p.is_active)
            return matchSearch && matchCat && matchStatus
        })
    }, [initialProducts, search, categoryFilter, statusFilter])

    const handleEdit = (product: ProductWithVariants) => {
        setEditingProduct(product)
        setShowFormModal(true)
    }

    const handleCreate = () => {
        setEditingProduct(undefined)
        setShowFormModal(true)
    }

    const handleDelete = (id: string, name: string) => {
        if (!window.confirm(`هل أنت متأكد من حذف المنتج "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return
        
        setLoadingId(id)
        startTransition(async () => {
            await adminDeleteProduct(id, name)
            setLoadingId(null)
            router.refresh()
        })
    }

    const handleToggleActive = (id: string, isActive: boolean, name: string) => {
        setLoadingId(id)
        startTransition(async () => {
            await adminToggleProductActive(id, !isActive, name)
            setLoadingId(null)
            router.refresh()
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">إدارة المنتجات</h2>
                        <p className="text-xs text-white/40 mt-0.5">{initialProducts.length} منتج في المتجر</p>
                    </div>
                </div>
                
                <button onClick={handleCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#0a0502] rounded-xl text-sm font-bold hover:bg-[#d4b86a] transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                    <Plus className="w-4 h-4" />
                    منتج جديد
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                           placeholder="ابحث باسم المنتج..."
                           className="w-full h-11 bg-[#111113] border border-white/[0.06] rounded-xl pr-11 pl-4 text-sm text-white placeholder:text-white/25 focus:border-[#c9a84c]/40 outline-none transition-all" />
                </div>
                <div className="flex gap-3">
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                            className="flex-1 md:w-48 h-11 bg-[#111113] border border-white/[0.06] rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all [&>option]:bg-[#1a1a1c]">
                        <option value="all">كل الأقسام</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="flex-1 md:w-40 h-11 bg-[#111113] border border-white/[0.06] rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all [&>option]:bg-[#1a1a1c]">
                        <option value="all">كل الحالات</option>
                        <option value="active">نشط فقط</option>
                        <option value="inactive">مخفي فقط</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-white/20 text-sm bg-[#111113] border border-white/[0.06] rounded-2xl">
                    لا توجد منتجات مطابقة للبحث
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => {
                        const isWorking = loadingId === product.id
                        return (
                            <div key={product.id} 
                                 className="flex flex-col bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden group hover:border-white/10 transition-all relative">
                                
                                {isWorking && (
                                    <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
                                    </div>
                                )}

                                {/* Image */}
                                <div className="aspect-square relative bg-white/[0.02]">
                                    {product.images?.[0] ? (
                                        <Image src={product.images[0]} alt={product.name_ar} fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                            <Package className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1.5">
                                        {!product.is_active && (
                                            <span className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-md">مخفي</span>
                                        )}
                                        {product.is_featured && (
                                            <span className="bg-[#c9a84c]/90 text-black text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-md">مميز</span>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-1">
                                    <p className="text-[10px] text-[#c9a84c] mb-1">{product.category?.name_ar ?? 'بدون قسم'}</p>
                                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{product.name_ar}</h3>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-sm font-bold text-white/80 tabular-nums">
                                            {Number(product.base_price).toLocaleString()} ج
                                        </span>
                                        <span className="text-[10px] text-white/30">
                                            {product.variants?.length ? `${product.variants.length} أحجام` : 'حجم واحد'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/[0.06] border-t border-white/[0.06] bg-black/20">
                                    <button onClick={() => handleToggleActive(product.id, product.is_active, product.name_ar)}
                                            className={cn("h-10 flex items-center justify-center gap-1.5 text-[10px] font-bold transition-colors",
                                                product.is_active ? "text-amber-400/70 hover:text-amber-400 hover:bg-amber-400/10" : "text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10"
                                            )}>
                                        {product.is_active ? <><XCircle className="w-3.5 h-3.5" /> إخفاء</> : <><CheckCircle2 className="w-3.5 h-3.5" /> إظهار</>}
                                    </button>
                                    <button onClick={() => handleEdit(product)}
                                            className="h-10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-blue-400/70 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                                        <Edit className="w-3.5 h-3.5" /> تعديل
                                    </button>
                                    <button onClick={() => handleDelete(product.id, product.name_ar)}
                                            className="h-10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" /> حذف
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {showFormModal && (
                <ProductFormModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setShowFormModal(false)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </div>
    )
}
