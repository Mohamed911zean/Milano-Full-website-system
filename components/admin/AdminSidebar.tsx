'use client'

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard, Users, ShoppingBag, Activity,
    LogOut, Shield, Package, X, ChevronRight, Bell, LayoutGrid
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAdminSidebar } from '@/components/admin/AdminSidebarContext'

/* ─────────────────────────────────────────────────────── */
/*  Constants                                              */
/* ─────────────────────────────────────────────────────── */

const SIDEBAR_BG    = '#0d0d0f'
const SIDEBAR_WIDTH = '272px'

const ROLE_LABELS: Record<string, string> = {
    super_admin: 'سوبر أدمن',
    owner:       'المالك',
    operations:  'موظف عمليات',
}

interface AdminSidebarProps {
    currentUser: { email?: string; staffData: { role: string } }
    notifications: { newOrders: number }
}

/* ─────────────────────────────────────────────────────── */
/*  Nav items                                              */
/* ─────────────────────────────────────────────────────── */

function useNavItems(notifications: AdminSidebarProps['notifications']) {
    return [
        { href: '/admin/dashboard', label: 'نظرة عامة',  icon: LayoutDashboard },
        { href: '/admin/live-orders', label: 'الطلبات المباشرة', icon: Bell, badge: notifications.newOrders },
        { href: '/admin/orders',    label: 'الطلبات',     icon: ShoppingBag },
        { href: '/admin/products',  label: 'المنتجات',    icon: Package },
        { href: '/admin/categories', label: 'الأقسام', icon: LayoutGrid },
        { href: '/admin/staff',     label: 'الموظفون',    icon: Users },
        { href: '/admin/activity',  label: 'سجل النشاط', icon: Activity },
    ]
}

/* ─────────────────────────────────────────────────────── */
/*  Inner sidebar content (shared desktop + mobile)        */
/* ─────────────────────────────────────────────────────── */

function SidebarContent({
    currentUser,
    notifications,
    onClose,
}: AdminSidebarProps & { onClose?: () => void }) {
    const router   = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const navItems = useNavItems(notifications)

    const handleLogout = useCallback(async () => {
        onClose?.()
        await supabase.auth.signOut()
        router.push('/admin/login')
    }, [router, supabase, onClose])

    return (
        <div
            style={{ background: SIDEBAR_BG }}
            className="flex flex-col h-full w-full select-none"
        >
            {/* ── Header ── */}
            <div
                style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}
                className="flex items-center gap-3 px-5 py-4 shrink-0"
            >
                {/* Logo icon */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.05) 100%)',
                        border: '1px solid rgba(201,168,76,0.28)',
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                >
                    <Shield className="w-5 h-5 text-[#c9a84c]" />
                </div>

                {/* Brand name */}
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-white leading-tight tracking-wide">Milano</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a84c] opacity-80 mt-0.5">
                        Admin Panel
                    </p>
                </div>

                {/* Close btn — only shown as part of mobile header overlay */}
                {onClose && (
                    <button
                        onClick={onClose}
                        aria-label="إغلاق القائمة"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60
                                   hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-95 shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            style={isActive ? {
                                background: 'rgba(201,168,76,0.12)',
                                border: '1px solid rgba(201,168,76,0.22)',
                                boxShadow: '0 0 20px rgba(201,168,76,0.06)',
                            } : {
                                background: 'transparent',
                                border: '1px solid transparent',
                            }}
                            className={`
                                flex items-center gap-3.5 px-4 rounded-xl h-[50px]
                                transition-all duration-200 group
                                ${isActive
                                    ? 'text-[#c9a84c]'
                                    : 'text-white/65 hover:text-white hover:bg-white/[0.055] hover:border-white/[0.08]'
                                }
                            `}
                        >
                            {/* Icon */}
                            <item.icon
                                className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200
                                    ${isActive ? 'text-[#c9a84c]' : 'text-white/45 group-hover:text-white/75'}`}
                            />

                            {/* Label */}
                            <span className="font-semibold text-[13.5px] flex-1">{item.label}</span>

                            {/* Badge */}
                            {item.badge ? (
                                <span
                                    style={{ background: '#3b82f6' }}
                                    className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
                                >
                                    {item.badge > 99 ? '99+' : item.badge}
                                </span>
                            ) : isActive ? (
                                <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                            ) : null}
                        </Link>
                    )
                })}
            </nav>

            {/* ── Footer ── */}
            <div
                style={{ borderTop: '1px solid rgba(201,168,76,0.10)' }}
                className="p-4 space-y-3 shrink-0"
            >
                {/* User card */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl"
                >
                    {/* Avatar */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(201,168,76,0.22), rgba(201,168,76,0.06))',
                            border: '1px solid rgba(201,168,76,0.28)',
                        }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#c9a84c] text-sm font-black shrink-0"
                    >
                        {currentUser.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-white/85 font-semibold truncate leading-tight">
                            {currentUser.email}
                        </p>
                        <p className="text-[10px] text-[#c9a84c] font-semibold mt-0.5 opacity-90">
                            {ROLE_LABELS[currentUser.staffData.role] ?? currentUser.staffData.role}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.18)',
                    }}
                    className="
                        w-full flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl
                        text-[13px] font-bold text-red-400
                        hover:bg-red-500/15 hover:border-red-500/28 hover:text-red-300
                        transition-all duration-200 active:scale-[0.98]
                    "
                >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────── */
/*  Main export                                            */
/* ─────────────────────────────────────────────────────── */

export default function AdminSidebar(props: AdminSidebarProps) {
    const { isOpen, isMobileOpen, isMobile, closeMobile } = useAdminSidebar()

    /* ── Desktop sidebar ── */
    if (!isMobile) {
        return (
            <aside
                style={{
                    width: isOpen ? SIDEBAR_WIDTH : '0px',
                    background: SIDEBAR_BG,
                    borderLeft: '1px solid rgba(201,168,76,0.10)',
                    transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}
                className="h-screen sticky top-0 z-20"
                aria-label="Admin Navigation"
            >
                <div style={{ width: SIDEBAR_WIDTH }}>
                    <SidebarContent {...props} />
                </div>
            </aside>
        )
    }

    /* ── Mobile drawer ── */
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={closeMobile}
                aria-hidden="true"
                style={{
                    position: 'fixed', inset: 0, zIndex: 40,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(4px)',
                    transition: 'opacity 0.25s ease',
                    opacity: isMobileOpen ? 1 : 0,
                    pointerEvents: isMobileOpen ? 'auto' : 'none',
                }}
            />

            {/* Drawer panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Admin Navigation"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 50,
                    width: '85vw',
                    maxWidth: SIDEBAR_WIDTH,
                    background: SIDEBAR_BG,
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
                    transform: isMobileOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <SidebarContent {...props} onClose={closeMobile} />
            </div>
        </>
    )
}