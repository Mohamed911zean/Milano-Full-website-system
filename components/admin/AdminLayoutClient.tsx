'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

const NAV_LABELS: Record<string, string> = {
    '/admin/dashboard': 'نظرة عامة',
    '/admin/products':  'إدارة المنتجات',
    '/admin/orders':    'إدارة الطلبات',
    '/admin/staff':     'إدارة الموظفين',
    '/admin/activity':  'سجل النشاط',
}

interface AdminLayoutClientProps {
    children: React.ReactNode
    currentUser: { email?: string; staffData: { role: string } }
    notifications: { newOrders: number; openTickets: number }
}

export default function AdminLayoutClient({ children, currentUser, notifications }: AdminLayoutClientProps) {
    const pathname = usePathname()

    const pageTitle = Object.entries(NAV_LABELS).find(([key]) => pathname.startsWith(key))?.[1] ?? 'لوحة التحكم'
    const totalNotifications = notifications.newOrders + notifications.openTickets
    const hasNewOrders = notifications.newOrders > 0

    return (
        <SidebarProvider
            defaultOpen={true}
            className="min-h-screen w-full"
            dir="rtl"
            style={{ background: '#0a0a0b' } as React.CSSProperties}
        >
            <TooltipProvider>
                {/* Sidebar */}
                <AdminSidebar currentUser={currentUser} notifications={notifications} />

                {/* Main Content */}
                <SidebarInset className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#0a0a0b] overflow-hidden">

                    {/* Topbar */}
                    <header className="
                        shrink-0 sticky top-0 z-30
                        flex items-center justify-between
                        px-4 md:px-6 py-0
                        h-16
                        bg-[#0a0a0b] border-b border-white/[0.06]
                    ">
                        {/* Left side: Hamburger + Title */}
                        <div className="flex items-center gap-3">
                            {/* Mobile menu trigger */}
                            <SidebarTrigger
                                className="
                                     w-10 h-10 rounded-xl
                                    bg-white/[0.06] border border-white/[0.1]
                                    flex items-center justify-center
                                    text-white/70 hover:text-white hover:bg-white/[0.1]
                                    transition-all active:scale-95
                                   
                                "
                            />
                            <div>
                                <h1 className="text-base md:text-xl font-bold text-white leading-tight">
                                    {pageTitle}
                                </h1>
                                <p className="text-[10px] text-white/30 hidden sm:block" suppressHydrationWarning>
                                    {new Date().toLocaleDateString('ar-EG', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Right side: Notifications */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* New orders pill — hidden on xs */}
                            {hasNewOrders && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                                    </span>
                                    <span className="text-xs text-blue-400 font-bold">{notifications.newOrders} جديد</span>
                                </div>
                            )}

                            {/* Notification bell */}
                            <button
                                className="
                                    relative w-10 h-10 rounded-xl
                                    bg-white/[0.06] border border-white/[0.1]
                                    flex items-center justify-center
                                    text-white/70 hover:text-white hover:bg-white/[0.1]
                                    transition-all active:scale-95
                                "
                                aria-label={`${totalNotifications} إشعارات غير مقروءة`}
                            >
                                <Bell className="w-5 h-5" />
                                {totalNotifications > 0 && (
                                    <span className="
                                        absolute -top-1.5 -right-1.5 w-5 h-5
                                        bg-red-500 border-2 border-[#0a0a0b]
                                        rounded-full text-[9px] text-white font-black
                                        flex items-center justify-center
                                    ">
                                        {totalNotifications > 99 ? '99+' : totalNotifications}
                                    </span>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="p-4 md:p-6 lg:p-8 pb-24 max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </TooltipProvider>
        </SidebarProvider>
    )
}