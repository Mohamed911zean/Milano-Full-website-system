'use client'

import { useState, useTransition, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2, LayoutGrid, CheckCircle2, XCircle, Loader2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/app/actions/admin_categories'
import * as XLSX from 'xlsx'

interface CategoryWithCount {
    id: string
    name_ar: string
    name_en: string | null
    image_url: string | null
    sort_order: number
    is_active: boolean
    productsCount: number
}

function CategoryModal({ 
    category, 
    onClose, 
    onSuccess 
}: { 
    category?: CategoryWithCount, 
    onClose: () => void, 
    onSuccess: () => void 
}) {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name_ar: category?.name_ar ?? '',
        name_en: category?.name_en ?? '',
        image_url: category?.image_url ?? '',
        sort_order: category?.sort_order ?? 0,
        is_active: category?.is_active ?? true
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name_ar) return alert('الاسم بالعربية مطلوب')

        startTransition(async () => {
            const res = category 
                ? await adminUpdateCategory(category.id, formData)
                : await adminCreateCategory(formData)
            
            if (res.success) {
                onSuccess()
            } else {
                alert(res.message)
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111113] border border-white/[0.06] rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-bold text-white">{category ? 'تعديل قسم' : 'قسم جديد'}</h2>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <form id="cat-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-white/60 mb-1.5">الاسم (عربي) *</label>
                            <input 
                                value={formData.name_ar} 
                                onChange={e => setFormData({...formData, name_ar: e.target.value})}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:border-[#c9a84c] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/60 mb-1.5">الاسم (إنجليزي)</label>
                            <input 
                                value={formData.name_en} 
                                onChange={e => setFormData({...formData, name_en: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:border-[#c9a84c] outline-none text-left"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/60 mb-1.5">رابط الصورة (URL)</label>
                            <input 
                                value={formData.image_url} 
                                onChange={e => setFormData({...formData, image_url: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:border-[#c9a84c] outline-none text-left"
                                dir="ltr"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-white/60 mb-1.5">الترتيب</label>
                                <input 
                                    type="number"
                                    value={formData.sort_order} 
                                    onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:border-[#c9a84c] outline-none"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                <label className="flex items-center gap-2 cursor-pointer h-11">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_active}
                                        onChange={e => setFormData({...formData, is_active: e.target.checked})}
                                        className="w-4 h-4 accent-[#c9a84c]"
                                    />
                                    <span className="text-sm text-white/80">القسم نشط</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-white/[0.06] shrink-0">
                    <button 
                        form="cat-form"
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 bg-[#c9a84c] hover:bg-[#d4b86a] text-black font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {category ? 'حفظ التعديلات' : 'إضافة القسم'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CategoriesClient({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<CategoryWithCount | undefined>()
    const [isPending, startTransition] = useTransition()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const filtered = useMemo(() => {
        return initialCategories.filter(c => 
            c.name_ar.toLowerCase().includes(search.toLowerCase()) || 
            (c.name_en?.toLowerCase() || '').includes(search.toLowerCase())
        )
    }, [initialCategories, search])

    const handleCreate = () => {
        setEditingCategory(undefined)
        setShowModal(true)
    }

    const handleEdit = (cat: CategoryWithCount) => {
        setEditingCategory(cat)
        setShowModal(true)
    }

    const handleDelete = (id: string, name: string, count: number) => {
        if (count > 0) {
            alert('لا يمكن حذف القسم لوجود منتجات بداخله. الرجاء نقل المنتجات أو حذفها أولاً.')
            return
        }
        if (!window.confirm(`هل أنت متأكد من حذف القسم "${name}"؟`)) return
        
        setLoadingId(id)
        startTransition(async () => {
            const res = await adminDeleteCategory(id, name)
            if (!res.success) alert(res.message)
            setLoadingId(null)
            router.refresh()
        })
    }

    const exportToExcel = () => {
        const data = initialCategories.map(c => ({
            'ID': c.id,
            'الاسم بالعربية': c.name_ar,
            'الاسم بالإنجليزية': c.name_en || '-',
            'الترتيب': c.sort_order,
            'عدد المنتجات': c.productsCount,
            'الحالة': c.is_active ? 'نشط' : 'مخفي',
            'رابط الصورة': c.image_url || '-'
        }))

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Categories")
        XLSX.writeFile(wb, "milano_categories.xlsx")
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">إدارة الأقسام</h2>
                        <p className="text-xs text-white/40 mt-0.5">{initialCategories.length} قسم في المتجر</p>
                    </div>
                </div>
                
                <div className="flex w-full sm:w-auto gap-2">
                    <button onClick={exportToExcel}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4" />
                        تصدير
                    </button>
                    <button onClick={handleCreate}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#0a0502] rounded-xl text-sm font-bold hover:bg-[#d4b86a] transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                        <Plus className="w-4 h-4" />
                        قسم جديد
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="ابحث باسم القسم..."
                        className="w-full max-w-md h-11 bg-[#111113] border border-white/[0.06] rounded-xl pr-11 pl-4 text-sm text-white placeholder:text-white/25 focus:border-[#c9a84c]/40 outline-none transition-all" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(cat => {
                    const isWorking = loadingId === cat.id
                    return (
                        <div key={cat.id} 
                                className="flex flex-col bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden group hover:border-white/10 transition-all relative">
                            
                            {isWorking && (
                                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
                                </div>
                            )}

                            {/* Image */}
                            <div className="h-32 relative bg-white/[0.02]">
                                {cat.image_url ? (
                                    <Image src={cat.image_url} alt={cat.name_ar} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                        <LayoutGrid className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    {!cat.is_active && (
                                        <span className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-md">مخفي</span>
                                    )}
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md">
                                        ترتيب: {cat.sort_order}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex-1">
                                <h3 className="text-sm font-bold text-white line-clamp-1">{cat.name_ar}</h3>
                                {cat.name_en && <p className="text-[10px] text-white/40 mt-1 line-clamp-1" dir="ltr">{cat.name_en}</p>}
                                <p className="text-xs text-[#c9a84c] mt-3 font-semibold">{cat.productsCount} منتج</p>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/[0.06] border-t border-white/[0.06] bg-black/20">
                                <button onClick={() => handleEdit(cat)}
                                        className="h-10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-blue-400/70 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                                    <Edit className="w-3.5 h-3.5" /> تعديل
                                </button>
                                <button onClick={() => handleDelete(cat.id, cat.name_ar, cat.productsCount)}
                                        className="h-10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" /> حذف
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {showModal && (
                <CategoryModal 
                    category={editingCategory}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false)
                        router.refresh()
                    }}
                />
            )}
        </div>
    )
}
