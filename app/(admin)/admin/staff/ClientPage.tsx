'use client'

import { useState, useTransition } from 'react'
import { Plus, XCircle, CheckCircle2, Loader2, Users } from 'lucide-react'
import { toggleStaffActive } from '@/app/actions/admin'
import { CreateStaffModal } from '@/components/admin/CreateStaffModal'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface StaffMember {
    id: string
    full_name: string
    email: string | null
    phone: string | null
    role: string
    is_active: boolean
    created_at: string
}

const ROLE_LABELS: Record<string, string> = {
    super_admin: 'سوبر أدمن',
    owner:       'المالك',
    operations:  'موظف عمليات',
}

export default function StaffClientPage({ 
    initialStaff, 
    currentUserId,
    isOwner 
}: { 
    initialStaff: StaffMember[], 
    currentUserId: string,
    isOwner: boolean 
}) {
    const router = useRouter()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleToggleStaff = (id: string, currentActive: boolean) => {
        setTogglingId(id)
        startTransition(async () => {
            const result = await toggleStaffActive(id, !currentActive)
            if (result.success) {
                setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentActive } : s))
            }
            setTogglingId(null)
        })
    }

    const activeCount = staff.filter(s => s.is_active).length

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">إدارة الموظفين</h2>
                        <p className="text-xs text-white/40 mt-0.5">{activeCount} نشط من إجمالي {staff.length} موظف</p>
                    </div>
                </div>
                
                {isOwner && (
                    <button onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#0a0502] rounded-xl text-sm font-bold hover:bg-[#d4b86a] transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                        <Plus className="w-4 h-4" />
                        موظف جديد
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {staff.map(member => (
                    <div key={member.id}
                         className="flex flex-col bg-[#111113] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all group relative overflow-hidden">
                        
                        {member.role === 'owner' && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#c9a84c]/5 blur-xl rounded-full" />
                        )}

                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg",
                                    member.role === 'owner' ? "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]" :
                                    member.role === 'super_admin' ? "bg-purple-500/10 border-purple-500/30 text-purple-400" :
                                    "bg-white/5 border-white/10 text-white/50"
                                )}>
                                    {member.full_name?.[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white truncate max-w-[150px]">{member.full_name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-bold border',
                                            member.role === 'owner' ? 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20' :
                                            member.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            'bg-white/5 text-white/40 border-white/10'
                                        )}>
                                            {ROLE_LABELS[member.role] ?? member.role}
                                        </span>
                                        {!member.is_active && (
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                                موقوف
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-5 flex-1">
                            <p className="text-xs text-white/40 flex items-center gap-2">
                                <span className="w-14 inline-block">الإيميل:</span>
                                <span className="text-white/70 truncate">{member.email ?? '—'}</span>
                            </p>
                            <p className="text-xs text-white/40 flex items-center gap-2" dir="ltr">
                                <span className="w-14 inline-block text-right" dir="rtl">التليفون:</span>
                                <span className="text-white/70">{member.phone ?? '—'}</span>
                            </p>
                            <p className="text-xs text-white/40 flex items-center gap-2">
                                <span className="w-14 inline-block">انضم في:</span>
                                <span className="text-white/70">{new Date(member.created_at).toLocaleDateString('ar-EG')}</span>
                            </p>
                        </div>

                        {/* Actions */}
                        {isOwner && member.id !== currentUserId && member.role !== 'owner' && (
                            <div className="pt-4 border-t border-white/[0.06] flex justify-end">
                                <button
                                    onClick={() => handleToggleStaff(member.id, member.is_active)}
                                    disabled={togglingId === member.id}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all w-full justify-center",
                                        member.is_active
                                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                                    )}>
                                    {togglingId === member.id
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : member.is_active ? <><XCircle className="w-4 h-4" /> إيقاف الحساب</> : <><CheckCircle2 className="w-4 h-4" /> تفعيل الحساب</>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <CreateStaffModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </div>
    )
}
