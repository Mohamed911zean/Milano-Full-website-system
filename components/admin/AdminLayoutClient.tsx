'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

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
        /* FIX: We inject dir="rtl" and the primary background color directly here.
          This ensures Shadcn's internal flex layouts compute correctly across mobile drawers.
        */
        <SidebarProvider defaultOpen={true} className="min-h-screen bg-[#0a0a0b] w-full" dir="rtl">
            <TooltipProvider> 
                {/* Global ambient background layer */}
                <div 
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{ 
                        backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(201,168,76,0.04) 0%, transparent 50%)' 
                    }}
                />

                {/* Sidebar stays as a direct sibling layout item to SidebarInset */}
                <AdminSidebar
                    currentUser={currentUser}
                    notifications={notifications}
                />

                {/* Main Content Area */}
                <SidebarInset className="flex-1 flex flex-col min-h-screen min-w-0 relative z-10 bg-transparent overflow-hidden">
                    {/* Ambient glow behind main layout elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c9a84c]/5 blur-[120px] rounded-full pointer-events-none z-0" />

                    {/* Topbar Header */}
                    {/* FIX: Set clear background density bg-[#0a0a0b]/98 and backdrop filters to isolate scrolling text layers safely */}
                    <header className="shrink-0 bg-[#0a0a0b]/98 backdrop-blur-md border-b border-white/[0.06] px-4 md:px-8 py-4 flex items-center justify-between z-30 relative sticky top-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <SidebarTrigger className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all [&>svg]:w-5 [&>svg]:h-5" />
                            
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg md:text-2xl font-bold text-white tracking-wide">
                                    {pageTitle}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            {/* New orders pill */}
                            {hasNewOrders && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full animate-in fade-in slide-in-from-left-2 duration-300">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                                    </span>
                                    <span className="text-xs text-blue-400 font-bold">{notifications.newOrders} جديد</span>
                                </div>
                            )}

                            {/* Notification bell */}
                            <button 
                                className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 
                                           flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 
                                           transition-all active:scale-95"
                                aria-label={`${totalNotifications} إشعارات غير مقروءة`}
                            >
                                <Bell className="w-5 h-5" />
                                {totalNotifications > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 border-2 border-[#0a0a0b] 
                                                     rounded-full text-[9px] text-white font-black flex items-center justify-center
                                                     animate-in zoom-in duration-200">
                                        {totalNotifications > 99 ? '99+' : totalNotifications}
                                    </span>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Date bar */}
                    {/* FIX: Set high opacity slate background layer to avoid visual text collision artifacts when scrolling */}
                    <div className="shrink-0 px-4 md:px-8 py-2 border-b border-white/[0.03] bg-[#0a0a0b]/95 backdrop-blur-md hidden sm:block z-20 sticky top-[73px]">
                        <p className="text-xs text-white/30" suppressHydrationWarning>
                            {new Date().toLocaleDateString('ar-EG', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>

                    {/* Page Content viewport container block */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
                        <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </TooltipProvider>
        </SidebarProvider>
    )
}