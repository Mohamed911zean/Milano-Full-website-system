'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu, PanelRightOpen } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminSidebarProvider, useAdminSidebar } from '@/components/admin/AdminSidebarContext'

/* ─────────────────────────────────────────────────────── */
/*  Page title mapping                                     */
/* ─────────────────────────────────────────────────────── */

const NAV_LABELS: Record<string, string> = {
    '/admin/dashboard': 'نظرة عامة',
    '/admin/products':  'إدارة المنتجات',
    '/admin/orders':    'إدارة الطلبات',
    '/admin/staff':     'إدارة الموظفين',
    '/admin/activity':  'سجل النشاط',
}

/* ─────────────────────────────────────────────────────── */
/*  Inner layout (consumes sidebar context)                */
/* ─────────────────────────────────────────────────────── */

interface Props {
    children: React.ReactNode
    currentUser: { email?: string; staffData: { role: string } }
    notifications: { newOrders: number; openTickets: number }
}

function InnerLayout({ children, currentUser, notifications }: Props) {
    const pathname = usePathname()
    const { isOpen, isMobile, toggleDesktop, toggleMobile } = useAdminSidebar()

    const pageTitle       = Object.entries(NAV_LABELS).find(([k]) => pathname.startsWith(k))?.[1] ?? 'لوحة التحكم'
    const totalNotifs     = notifications.newOrders + notifications.openTickets
    const hasNewOrders    = notifications.newOrders > 0

    return (
        /* Full-screen RTL flex row */
        <div
            dir="rtl"
            className="flex h-screen overflow-hidden"
            style={{ background: '#0a0a0b' }}
        >
            {/* ── Sidebar ── */}
            <AdminSidebar currentUser={currentUser} notifications={notifications} />

            {/* ── Main column ── */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* ── Topbar ── */}
                <header
                    className="shrink-0 flex items-center justify-between px-4 md:px-6 h-16"
                    style={{
                        background: '#0a0a0b',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    {/* ─ Start (RTL: right side) — toggle + title ─ */}
                    <div className="flex items-center gap-3">

                        {/* Toggle button */}
                        <button
                            onClick={isMobile ? toggleMobile : toggleDesktop}
                            aria-label="تبديل القائمة الجانبية"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                            className="
                                w-10 h-10 rounded-xl flex items-center justify-center
                                text-white/65 hover:text-white hover:bg-white/10
                                transition-all duration-200 active:scale-95 shrink-0
                            "
                        >
                            {isMobile
                                ? <Menu className="w-5 h-5" />
                                : <PanelRightOpen className="w-5 h-5" />
                            }
                        </button>

                        {/* Page title + date */}
                        <div>
                            <h1 className="text-[15px] md:text-[18px] font-bold text-white leading-tight">
                                {pageTitle}
                            </h1>
                            <p className="text-[10px] text-white/30 hidden sm:block mt-0.5" suppressHydrationWarning>
                                {new Date().toLocaleDateString('ar-EG', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    {/* ─ End (RTL: left side) — notifications ─ */}
                    <div className="flex items-center gap-2 md:gap-3">

                        {/* New-orders live pill */}
                        {hasNewOrders && (
                            <div
                                style={{
                                    background: 'rgba(59,130,246,0.12)',
                                    border: '1px solid rgba(59,130,246,0.22)',
                                }}
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                                </span>
                                <span className="text-[12px] text-blue-400 font-bold">
                                    {notifications.newOrders} جديد
                                </span>
                            </div>
                        )}

                        {/* Bell */}
                        <button
                            aria-label={`${totalNotifs} إشعارات`}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                            className="
                                relative w-10 h-10 rounded-xl flex items-center justify-center
                                text-white/65 hover:text-white hover:bg-white/10
                                transition-all duration-200 active:scale-95
                            "
                        >
                            <Bell className="w-5 h-5" />
                            {totalNotifs > 0 && (
                                <span
                                    style={{ background: '#ef4444', border: '2px solid #0a0a0b' }}
                                    className="
                                        absolute -top-1.5 -right-1.5 w-5 h-5
                                        rounded-full text-[9px] text-white font-black
                                        flex items-center justify-center
                                    "
                                >
                                    {totalNotifs > 99 ? '99+' : totalNotifs}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* ── Scrollable page content ── */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-4 md:p-6 lg:p-8 pb-24 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────── */
/*  Public export — wraps InnerLayout in the provider      */
/* ─────────────────────────────────────────────────────── */

export default function AdminLayoutClient(props: Props) {
    return (
        <AdminSidebarProvider>
            <InnerLayout {...props} />
        </AdminSidebarProvider>
    )
}