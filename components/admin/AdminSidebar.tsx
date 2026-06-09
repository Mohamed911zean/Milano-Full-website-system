'use client'

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard, Users, ShoppingBag, Activity,
    LogOut, Shield, Package, ChevronLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"

const ROLE_LABELS: Record<string, string> = {
    super_admin: 'سوبر أدمن',
    owner: 'المالك',
    operations: 'موظف عمليات',
}

interface AdminSidebarProps {
    currentUser: { email?: string; staffData: { role: string } }
    notifications: { newOrders: number; openTickets: number }
}

export default function AdminSidebar({ currentUser, notifications }: AdminSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const { setOpenMobile, isMobile } = useSidebar()

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }, [router, supabase])

    const handleNavClick = useCallback(() => {
        if (isMobile) setOpenMobile(false)
    }, [isMobile, setOpenMobile])

    const navItems = [
        { href: '/admin/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
        { href: '/admin/products', label: 'المنتجات', icon: Package },
        { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag, badge: notifications.newOrders },
        { href: '/admin/staff', label: 'الموظفون', icon: Users },
        { href: '/admin/activity', label: 'سجل النشاط', icon: Activity },
    ]

    return (
        <Sidebar
            side="right"
            variant="sidebar"
            className="admin-sidebar border-l border-[#c9a84c]/10"
        >
            {/* ── Header ── */}
            <SidebarHeader className="admin-sidebar-section border-b border-[#c9a84c]/10 p-5">
                <div className="flex items-center gap-3">
                    {/* Logo mark */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-white leading-tight">Milano</p>
                        <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest font-black">Admin Panel</p>
                    </div>
                    {/* Mobile close button */}
                    {isMobile && (
                        <button
                            onClick={() => setOpenMobile(false)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                            aria-label="إغلاق القائمة"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </SidebarHeader>

            {/* ── Navigation ── */}
            <SidebarContent className="admin-sidebar-section">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1 p-3">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            onClick={handleNavClick}
                                            className={`
                                                h-12 px-4 rounded-xl transition-all duration-200 w-full
                                                ${isActive
                                                    ? 'bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/25 shadow-[0_0_20px_rgba(201,168,76,0.08)] hover:bg-[#c9a84c]/20'
                                                    : 'text-white/75 hover:text-white hover:bg-white/[0.07] border border-transparent'
                                                }
                                            `}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 w-full">
                                                <div className={`relative shrink-0 ${isActive ? 'text-[#c9a84c]' : 'text-white/60'}`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-sm flex-1">{item.label}</span>
                                                {item.badge ? (
                                                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-5">
                                                        {item.badge > 99 ? '99+' : item.badge}
                                                    </span>
                                                ) : null}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* ── Footer / User Info ── */}
            <SidebarFooter className="admin-sidebar-section border-t border-[#c9a84c]/10 p-4 gap-3">
                {/* User card */}
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c]/25 to-[#c9a84c]/5 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] text-sm font-black shrink-0">
                        {currentUser.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-white/80 font-bold truncate">{currentUser.email}</p>
                        <p className="text-[10px] text-[#c9a84c] font-semibold mt-0.5">
                            {ROLE_LABELS[currentUser.staffData.role] ?? currentUser.staffData.role}
                        </p>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="
                        w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl
                        text-sm font-bold text-red-400 
                        bg-red-500/[0.08] border border-red-500/20
                        hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-300
                        transition-all duration-200 active:scale-[0.98]
                    "
                >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}