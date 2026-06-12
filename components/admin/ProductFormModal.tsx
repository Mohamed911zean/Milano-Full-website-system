'use client'

import { useState, useTransition, useRef } from 'react'
import { X, Upload, Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { adminCreateProduct, adminUpdateProduct } from '@/app/actions/admin_products'
import { uploadProductImage } from '@/lib/utils/uploadImage'
import { cn } from '@/lib/utils'
import type { Category, ProductWithVariants } from '@/lib/supabase/types'
import Image from 'next/image'

interface ProductFormModalProps {
    product?: ProductWithVariants
    categories: Category[]
    onClose: () => void
    onSuccess: () => void
}

export function ProductFormModal({ product, categories, onClose, onSuccess }: ProductFormModalProps) {
    const isEdit = !!product
    const [loading, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        nameAr: product?.name_ar ?? '',
        descriptionAr: product?.description_ar ?? '',
        categoryId: product?.category_id ?? (categories[0]?.id || ''),
        basePrice: product?.base_price?.toString() ?? '',
        pricingUnit: product?.pricing_unit ?? 'per_item',
        preparationType: product?.preparation_type ?? 'ready_made',
        prepDurationMinutes: product?.prep_duration_minutes?.toString() ?? '',
        allowsTextOnCake: product?.allows_text_on_cake ?? false,
        isFeatured: product?.is_featured ?? false,
    })

    const [variants, setVariants] = useState(
        product?.variants?.map(v => ({ id: v.id, nameAr: v.name_ar, price: v.price.toString(), isDefault: v.is_default })) ?? []
    )

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(product?.images?.[0] ?? null)
    const [uploadingImage, setUploadingImage] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            setError('حجم الصورة يجب ألا يتجاوز 5 ميجابايت')
            return
        }
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setError(null)
    }

    const addVariant = () => {
        setVariants([...variants, { id: crypto.randomUUID(), nameAr: '', price: '', isDefault: variants.length === 0 }])
    }
    const removeVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id))
    }
    const updateVariant = (id: string, field: string, value: string | boolean) => {
        setVariants(variants.map(v => {
            if (v.id !== id) return field === 'isDefault' && value ? { ...v, isDefault: false } : v
            return { ...v, [field]: value }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!form.nameAr.trim()) { setError('اسم المنتج مطلوب'); return }
        if (!form.basePrice || isNaN(Number(form.basePrice))) { setError('السعر الأساسي غير صحيح'); return }

        startTransition(async () => {
            try {
                let imageUrl = product?.images?.[0]
                const finalVariants = variants.map((v, i) => ({
                    nameAr: v.nameAr, price: Number(v.price), isDefault: v.isDefault, sortOrder: i
                }))

                const input = {
                    categoryId: form.categoryId,
                    nameAr: form.nameAr,
                    descriptionAr: form.descriptionAr,
                    basePrice: Number(form.basePrice),
                    pricingUnit: form.pricingUnit as any,
                    preparationType: form.preparationType as any,
                    prepDurationMinutes: form.prepDurationMinutes ? Number(form.prepDurationMinutes) : undefined,
                    allowsTextOnCake: form.allowsTextOnCake,
                    isFeatured: form.isFeatured,
                    sortOrder: product?.sort_order ?? 0,
                    variants: finalVariants
                }

                if (isEdit) {
                    await adminUpdateProduct(product.id, input)
                    if (imageFile) {
                        setUploadingImage(true)
                        imageUrl = await uploadProductImage(imageFile, product.id)
                        await adminUpdateProduct(product.id, { imageUrl })
                    }
                } else {
                    const result = await adminCreateProduct(input)
                    if (!result.success || !result.productId) throw new Error(result.message)
                    if (imageFile) {
                        setUploadingImage(true)
                        imageUrl = await uploadProductImage(imageFile, result.productId)
                        await adminUpdateProduct(result.productId, { imageUrl })
                    }
                }

                onSuccess()
                onClose()
            } catch (err: any) {
                setError(err.message ?? 'حصل خطأ أثناء الحفظ')
                setUploadingImage(false)
            }
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#111113] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.06] shrink-0">
                    <h3 className="text-xl font-bold text-white">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto scroll-smooth">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Image Upload */}
                        <div>
                            <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-2">صورة المنتج</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-40 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center justify-center cursor-pointer overflow-hidden relative group">
                                {previewUrl ? (
                                    <>
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="w-6 h-6 text-white mb-2 shadow-lg" />
                                            <span className="text-xs font-bold text-white shadow-lg">تغيير الصورة</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-white/30">
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="text-sm font-medium">اضغط لرفع صورة المنتج</span>
                                        <span className="text-[10px]">JPG, PNG, WEBP (Max 5MB)</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">اسم المنتج (عربي) *</label>
                                <input required value={form.nameAr} onChange={e => setForm(p => ({ ...p, nameAr: e.target.value }))}
                                       className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">القسم *</label>
                                <select required value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all [&>option]:bg-[#1a1a1c]">
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">الوصف</label>
                            <textarea value={form.descriptionAr} onChange={e => setForm(p => ({ ...p, descriptionAr: e.target.value }))}
                                      className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">السعر الأساسي *</label>
                                <input required type="number" min="0" value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))}
                                       className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">وحدة التسعير</label>
                                <select value={form.pricingUnit} onChange={e => setForm(p => ({ ...p, pricingUnit: e.target.value }))}
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all [&>option]:bg-[#1a1a1c]">
                                    <option value="per_item">بالقطعة</option>
                                    <option value="per_dozen">بالدستة</option>
                                    <option value="per_kg">بالكيلو</option>
                                    <option value="per_box">بالعلبة</option>
                                </select>
                            </div>
                        </div>

                        {/* Prep type */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-6">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">نوع التجهيز</label>
                                <select value={form.preparationType} onChange={e => setForm(p => ({ ...p, preparationType: e.target.value }))}
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all [&>option]:bg-[#1a1a1c]">
                                    <option value="ready_made">جاهز للاستلام</option>
                                    <option value="made_to_order">يُجهز بالطلب</option>
                                </select>
                            </div>
                            {form.preparationType === 'made_to_order' && (
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">مدة التجهيز (بالدقائق)</label>
                                    <input type="number" min="0" value={form.prepDurationMinutes} onChange={e => setForm(p => ({ ...p, prepDurationMinutes: e.target.value }))}
                                           className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all" />
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="flex gap-6 border-t border-white/[0.06] pt-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", form.isFeatured ? "bg-[#c9a84c] border-[#c9a84c]" : "border-white/20 group-hover:border-white/40")}>
                                    {form.isFeatured && <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-black"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                <span className="text-sm text-white/80 select-none">منتج مميز (الأكثر مبيعاً)</span>
                                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="hidden" />
                            </label>
                            
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", form.allowsTextOnCake ? "bg-[#c9a84c] border-[#c9a84c]" : "border-white/20 group-hover:border-white/40")}>
                                    {form.allowsTextOnCake && <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-black"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                <span className="text-sm text-white/80 select-none">يسمح بكتابة نص (للكيك)</span>
                                <input type="checkbox" checked={form.allowsTextOnCake} onChange={e => setForm(p => ({ ...p, allowsTextOnCake: e.target.checked }))} className="hidden" />
                            </label>
                        </div>

                        {/* Variants */}
                        <div className="border-t border-white/[0.06] pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-medium block">أحجام / أصناف إضافية (Variants)</label>
                                    <p className="text-[10px] text-white/30 mt-0.5">لو المنتج له أحجام أو أشكال بأسعار مختلفة</p>
                                </div>
                                <button type="button" onClick={addVariant} className="h-8 px-3 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-bold hover:bg-[#c9a84c]/20 transition-colors flex items-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> أضف صنف
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {variants.map((variant) => (
                                    <div key={variant.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                                        <div className="flex-1">
                                            <input placeholder="الاسم (مثال: حجم كبير)" value={variant.nameAr} onChange={e => updateVariant(variant.id, 'nameAr', e.target.value)} required
                                                   className="w-full h-9 bg-transparent border-b border-white/10 px-2 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all" />
                                        </div>
                                        <div className="w-24">
                                            <input placeholder="السعر" type="number" min="0" value={variant.price} onChange={e => updateVariant(variant.id, 'price', e.target.value)} required
                                                   className="w-full h-9 bg-transparent border-b border-white/10 px-2 text-sm text-white focus:border-[#c9a84c]/40 outline-none transition-all" />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                                            <input type="radio" name="defaultVariant" checked={variant.isDefault} onChange={() => updateVariant(variant.id, 'isDefault', true)} className="accent-[#c9a84c]" />
                                            <span className="text-[10px] text-white/60">افتراضي</span>
                                        </label>
                                        <button type="button" onClick={() => removeVariant(variant.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-1 mt-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {variants.length === 0 && (
                                    <div className="text-center py-4 text-[11px] text-white/20 border border-dashed border-white/10 rounded-xl">
                                        لا توجد أصناف إضافية (سيعتمد على السعر الأساسي)
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{error}</p>}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/[0.06] flex gap-3 shrink-0 bg-[#0c0c0e] rounded-b-2xl">
                    <button type="button" onClick={onClose} className="flex-1 h-11 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-medium hover:bg-white/8 hover:text-white transition-all">
                        إلغاء
                    </button>
                    <button type="submit" form="product-form" disabled={loading || uploadingImage}
                            className="flex-[2] h-11 bg-[#c9a84c] text-[#0a0502] rounded-xl text-sm font-bold hover:bg-[#d4b86a] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                        {(loading || uploadingImage) ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? 'حفظ التعديلات' : 'إضافة المنتج')}
                    </button>
                </div>
            </div>
        </div>
    )
}
