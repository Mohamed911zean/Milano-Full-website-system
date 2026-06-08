'use client'
// app/(admin)/admin/dashboard/client.tsx

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard, Users, ShoppingBag, CakeSlice,
    LifeBuoy, TrendingUp, LogOut, Plus, X,
    CheckCircle2, XCircle, Clock, Loader2,
    ArrowUpRight, Shield, Activity, ChevronRight,
    ToggleLeft, ToggleRight, Eye, EyeOff,
    Settings, Bell
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
    createStaffMember,
    toggleStaffActive,
    resetStaffPassword,
} from '@/app/actions/admin'

// ─── Types ───────────────────────────────────────────────────
interface StaffMember {
    id: string
    full_name: string
    email: string | null
    phone: string | null
    role: string
    is_active: boolean
    created_at: string
    last_seen: string | null
}

interface Order {
    id: string
    order_number: string
    customer_name: string
    customer_phone: string
    status: string
    total_price: number
    created_at: string
}

interface ActivityLog {
    id: string
    action: string
    target_type: string | null
    meta: Record<string, unknown> | null
    created_at: string
    staff: { full_name: string; role: string } | null
}

interface Props {
    currentUser: { id?: string; email?: string; staffData: { role: string } }
    stats: {
        totalOrders: number; todayOrders: number; totalRevenue: number
        monthRevenue: number; newOrders: number; specialOrders: number
        openTickets: number; totalStaff: number; activeStaff: number
    }
    staffList: StaffMember[]
    recentOrders: Order[]
    activityLog: ActivityLog[]
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    new:              { label: 'جديد',        color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    confirmed:        { label: 'مؤكد',        color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
    in_preparation:   { label: 'يُحضَّر',      color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    ready:            { label: 'جاهز',        color: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
    out_for_delivery: { label: 'في الطريق',   color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
    delivered:        { label: 'تم التوصيل', color: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
    picked_up:        { label: 'استُلم',      color: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
    cancelled:        { label: 'ملغي',        color: 'bg-red-500/15 text-red-400 border-red-500/20' },
}

const ROLE_LABELS: Record<string, string> = {
    super_admin: 'سوبر أدمن',
    owner:       'المالك',
    operations:  'موظف',
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent }: {
    label: string; value: string | number; sub?: string
    icon: React.ElementType; accent: string
}) {
    return (
        <div className="relative overflow-hidden bg-[#111113] border border-white/[0.06] rounded-2xl p-5 group hover:border-white/10 transition-all duration-300">
            <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity', accent)} />
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', accent.replace('bg-', 'bg-').replace('/20', '/15'))}>
                    <Icon className="w-4 h-4 text-white/70" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-white relative z-10">{typeof value === 'number' ? value.toLocaleString('ar-EG') : value}</p>
            <p className="text-xs text-white/40 mt-1 relative z-10">{label}</p>
            {sub && <p className="text-[10px] text-white/25 mt-0.5 relative z-10">{sub}</p>}
        </div>
    )
}

// ─── Create Staff Modal ───────────────────────────────────────
function CreateStaffModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
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
                    <h3 className="text-lg font-bold text-white">إضافة موظف جديد</h3>
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

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 h-11 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-medium hover:bg-white/8 transition-all">
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

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboardClient({ currentUser, stats, staffList: initialStaff, recentOrders, activityLog }: Props) {
    const router = useRouter()
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'orders' | 'activity'>('overview')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

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

    const navItems = [
        { id: 'overview',  label: 'نظرة عامة', icon: LayoutDashboard },
        { id: 'staff',     label: 'الموظفون',   icon: Users },
        { id: 'orders',    label: 'الطلبات',    icon: ShoppingBag },
        { id: 'activity',  label: 'السجل',      icon: Activity },
    ] as const

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex" dir="rtl"
             style={{ backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(201,168,76,0.04) 0%, transparent 50%)' }}>

            {/* ── Sidebar ── */}
            <aside className="w-56 shrink-0 border-l border-white/[0.06] flex flex-col bg-[#0c0c0e]">
                {/* Logo */}
                <div className="px-5 py-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-[#c9a84c]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-none">Milano</p>
                            <p className="text-[10px] text-white/30 mt-0.5 leading-none">Super Admin</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
                                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-right',
                                    activeTab === id
                                        ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/15'
                                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                )}>
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="font-medium">{label}</span>
                            {id === 'orders' && stats.newOrders > 0 && (
                                <span className="mr-auto bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {stats.newOrders}
                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="p-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
                        <div className="w-7 h-7 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-xs font-bold shrink-0">
                            {currentUser.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-white/70 font-medium truncate">{currentUser.email}</p>
                            <p className="text-[10px] text-[#c9a84c]/70">{ROLE_LABELS[currentUser.staffData.role]}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all">
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 overflow-y-auto">

                {/* Topbar */}
                <div className="sticky top-0 z-10 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-white">
                            {activeTab === 'overview'  && 'نظرة عامة'}
                            {activeTab === 'staff'     && 'إدارة الموظفين'}
                            {activeTab === 'orders'    && 'الطلبات الأخيرة'}
                            {activeTab === 'activity'  && 'سجل النشاط'}
                        </h1>
                        <p className="text-xs text-white/30 mt-0.5">
                            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {stats.newOrders > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                <span className="text-xs text-blue-400 font-medium">{stats.newOrders} طلب جديد</span>
                            </div>
                        )}
                        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors relative">
                            <Bell className="w-4 h-4" />
                            {(stats.newOrders + stats.openTickets) > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {stats.newOrders + stats.openTickets}
                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-8">

                    {/* ══ OVERVIEW ══════════════════════════════════════ */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard label="إجمالي الطلبات" value={stats.totalOrders}
                                          sub="منذ البداية" icon={ShoppingBag} accent="bg-blue-500" />
                                <StatCard label="طلبات اليوم" value={stats.todayOrders}
                                          sub="آخر 24 ساعة" icon={TrendingUp} accent="bg-emerald-500" />
                                <StatCard label="إيرادات الشهر" value={`${stats.monthRevenue.toLocaleString()} ج`}
                                          sub="الشهر الحالي" icon={TrendingUp} accent="bg-[#c9a84c]" />
                                <StatCard label="الإيرادات الكلية" value={`${stats.totalRevenue.toLocaleString()} ج`}
                                          sub="إجمالي" icon={TrendingUp} accent="bg-purple-500" />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard label="طلبات جديدة" value={stats.newOrders}
                                          sub="تحتاج مراجعة" icon={Clock} accent="bg-amber-500" />
                                <StatCard label="كيكات مناسبات" value={stats.specialOrders}
                                          sub="طلبات خاصة جديدة" icon={CakeSlice} accent="bg-pink-500" />
                                <StatCard label="تذاكر مفتوحة" value={stats.openTickets}
                                          sub="دعم فني" icon={LifeBuoy} accent="bg-red-500" />
                                <StatCard label="الموظفون النشطون" value={`${stats.activeStaff}/${stats.totalStaff}`}
                                          sub="من إجمالي الفريق" icon={Users} accent="bg-teal-500" />
                            </div>

                            {/* Recent Orders */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest">آخر الطلبات</h2>
                                    <button onClick={() => setActiveTab('orders')}
                                            className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors flex items-center gap-1">
                                        عرض الكل <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <OrdersTable orders={recentOrders} />
                            </div>
                        </div>
                    )}

                    {/* ══ STAFF ═════════════════════════════════════════ */}
                    {activeTab === 'staff' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/40">{stats.activeStaff} نشط من {stats.totalStaff} موظف</p>
                                </div>
                                <button onClick={() => setShowCreateModal(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0502] rounded-xl text-sm font-bold hover:bg-[#d4b86a] transition-all">
                                    <Plus className="w-4 h-4" />
                                    موظف جديد
                                </button>
                            </div>

                            <div className="space-y-2">
                                {staff.map(member => (
                                    <div key={member.id}
                                         className="flex items-center gap-4 bg-[#111113] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-all group">

                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/15 flex items-center justify-center text-[#c9a84c] font-bold text-sm shrink-0">
                                            {member.full_name?.[0]}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-sm font-bold text-white truncate">{member.full_name}</p>
                                                <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border',
                                                    member.role === 'super_admin'
                                                        ? 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20'
                                                        : 'bg-white/5 text-white/40 border-white/10'
                                                )}>
                          {ROLE_LABELS[member.role] ?? member.role}
                        </span>
                                                {!member.is_active && (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            موقوف
                          </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-white/30 truncate">{member.email ?? '—'}</p>
                                        </div>

                                        {/* Phone */}
                                        <p className="text-xs text-white/30 hidden md:block" dir="ltr">{member.phone ?? '—'}</p>

                                        {/* Joined */}
                                        <p className="text-[10px] text-white/20 hidden lg:block whitespace-nowrap">
                                            {new Date(member.created_at).toLocaleDateString('ar-EG')}
                                        </p>

                                        {/* Toggle */}
                                        {member.id !== currentUser.id && (
                                            <button
                                                onClick={() => handleToggleStaff(member.id, member.is_active)}
                                                disabled={togglingId === member.id}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0"
                                                style={member.is_active
                                                    ? { background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: 'rgb(248,113,113)' }
                                                    : { background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)', color: 'rgb(52,211,153)' }
                                                }>
                                                {togglingId === member.id
                                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                                    : member.is_active ? <><XCircle className="w-3 h-3" /> إيقاف</> : <><CheckCircle2 className="w-3 h-3" /> تفعيل</>
                                                }
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ══ ORDERS ════════════════════════════════════════ */}
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            <OrdersTable orders={recentOrders} />
                        </div>
                    )}

                    {/* ══ ACTIVITY LOG ══════════════════════════════════ */}
                    {activeTab === 'activity' && (
                        <div className="space-y-2">
                            {activityLog.length === 0 ? (
                                <div className="text-center py-20 text-white/20 text-sm">لا يوجد نشاط مسجل بعد</div>
                            ) : (
                                activityLog.map(log => (
                                    <div key={log.id} className="flex items-start gap-4 bg-[#111113] border border-white/[0.06] rounded-xl p-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 shrink-0 mt-0.5">
                                            <Activity className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/70">{log.action}</p>
                                            <p className="text-xs text-white/30 mt-0.5">{log.staff?.full_name ?? 'غير معروف'}</p>
                                        </div>
                                        <p className="text-[10px] text-white/20 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString('ar-EG')}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </main>

            {showCreateModal && (
                <CreateStaffModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </div>
    )
}

// ─── Orders Table Component ───────────────────────────────────
function OrdersTable({ orders }: { orders: Order[] }) {
    if (!orders.length) return (
        <div className="text-center py-16 text-white/20 text-sm bg-[#111113] rounded-2xl border border-white/[0.06]">
            لا توجد طلبات
        </div>
    )

    return (
        <div className="bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[140px_1fr_120px_90px_80px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-white/25">
                <span>رقم الطلب</span>
                <span>الزبون</span>
                <span>الحالة</span>
                <span>المبلغ</span>
                <span>التاريخ</span>
            </div>
            {orders.map((order, i) => {
                const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-white/5 text-white/40 border-white/10' }
                return (
                    <div key={order.id}
                         className={cn('grid grid-cols-[140px_1fr_120px_90px_80px] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors',
                             i < orders.length - 1 && 'border-b border-white/[0.04]'
                         )}>
                        <span className="text-xs font-mono text-white/60">{order.order_number}</span>
                        <div>
                            <p className="text-sm font-medium text-white/80 truncate">{order.customer_name}</p>
                            <p className="text-[10px] text-white/30 font-mono">{order.customer_phone}</p>
                        </div>
                        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border', statusInfo.color)}>
              {statusInfo.label}
            </span>
                        <span className="text-sm font-bold text-white/70">{Number(order.total_price).toLocaleString()} ج</span>
                        <span className="text-[10px] text-white/25">
              {new Date(order.created_at).toLocaleDateString('ar-EG')}
            </span>
                    </div>
                )
            })}
        </div>
    )
}