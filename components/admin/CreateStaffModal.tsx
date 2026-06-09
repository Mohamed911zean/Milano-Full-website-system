'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X, EyeOff, Eye, Loader2 } from 'lucide-react'
import { createStaffMember } from '@/app/actions/admin'
import { cn } from '@/lib/utils'

export function CreateStaffModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', password: '',
        role: 'operations' as 'operations' | 'super_admin',
    })
    const [showPass, setShowPass] = useState(false)
    const [loading, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        startTransition(async () => {
            const result = await createStaffMember(form)
            if (!result.success) { setError(result.message ?? 'حصل خطأ'); return }
            onSuccess()
            onClose()
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#111113] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">إضافة حساب جديد</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">الاسم الكامل *</label>
                        <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                               className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus:border-[#c9a84c]/40 outline-none transition-all"
                               placeholder="أحمد محمد" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">الإيميل *</label>
                            <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus:border-[#c9a84c]/40 outline-none transition-all"
                                   placeholder="staff@milano.eg" />
                        </div>
                        <div>
                            <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">التليفون</label>
                            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus:border-[#c9a84c]/40 outline-none transition-all"
                                   placeholder="01xxxxxxxxx" dir="ltr" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">كلمة المرور *</label>
                        <div className="relative">
                            <input required type={showPass ? 'text' : 'password'} minLength={8} value={form.password}
                                   onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 pl-11 text-sm text-white placeholder:text-white/20 focus:border-[#c9a84c]/40 outline-none transition-all"
                                   placeholder="8 أحرف على الأقل" />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-1.5">الصلاحية</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { val: 'operations', label: 'موظف عمليات', desc: 'إدارة الطلبات فقط' },
                                { val: 'super_admin', label: 'سوبر أدمن', desc: 'صلاحيات كاملة' },
                            ].map(opt => (
                                <button key={opt.val} type="button" onClick={() => setForm(p => ({ ...p, role: opt.val as 'operations' | 'super_admin' }))}
                                        className={cn('p-3 rounded-xl border text-right transition-all',
                                            form.role === opt.val ? 'border-[#c9a84c]/40 bg-[#c9a84c]/8' : 'border-white/10 hover:border-white/20'
                                        )}>
                                    <p className={cn('text-xs font-bold', form.role === opt.val ? 'text-[#c9a84c]' : 'text-white/70')}>{opt.label}</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{error}</p>}

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 h-11 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-medium hover:bg-white/8 hover:text-white transition-all">
                            إلغاء
                        </button>
                        <button type="submit" disabled={loading}
                                className="flex-1 h-11 bg-[#c9a84c] text-[#0a0502] rounded-xl text-sm font-bold hover:bg-[#d4b86a] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إنشاء الحساب'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
