'use client'

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard, Users, ShoppingBag, Activity,
    LogOut, Shield, Package
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
    SidebarMenuBadge,
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
    const { setOpenMobile } = useSidebar()

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }, [router, supabase])

    const navItems = [
        { href: '/admin/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
        { href: '/admin/products', label: 'المنتجات', icon: Package },
        { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag, badge: notifications.newOrders },
        { href: '/admin/staff', label: 'الموظفون', icon: Users },
        { href: '/admin/activity', label: 'سجل النشاط', icon: Activity },
    ]

    return (
        /* FIX: Added clear structural backgrounds that override the default mobile Sheet content 
          components so it doesn't default back to white or semi-transparent states on mobile drawers.
        */
        <Sidebar 
            side="right" 
            variant="sidebar" 
            className="border-l border-white/[0.06] bg-[#0c0c0e] text-sidebar-foreground"
        >
            <SidebarHeader className="border-b border-white/[0.06] p-4 bg-[#0c0c0e]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-white leading-tight">Milano</p>
                        <p className="text-[10px] text-[#c9a84c]/60 uppercase tracking-widest font-black">Admin</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-[#0c0c0e]">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2 p-2">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <SidebarMenuItem key={item.href} className="relative">
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={isActive}
                                            tooltip={item.label}
                                            onClick={() => setOpenMobile(false)}
                                            className={`h-12 px-4 rounded-xl transition-all ${
                                                isActive 
                                                    ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/15 hover:bg-[#c9a84c]/20 hover:text-[#c9a84c]' 
                                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 w-full">
                                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#c9a84c]' : ''}`} />
                                                <span className="font-bold text-sm">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        
                                        {item.badge ? (
                                            /* FIX: Ensuring absolute positioning alignment constraints safety for badge elements under RTL */
                                            <SidebarMenuBadge className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full right-auto left-2 pointer-events-none select-none">
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        ) : null}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/[0.06] p-4 bg-[#0c0c0e]">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-3 bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] text-sm font-black shrink-0">
                        {currentUser.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-white/70 font-bold truncate">{currentUser.email}</p>
                        <p className="text-[10px] text-[#c9a84c]">{ROLE_LABELS[currentUser.staffData.role] ?? currentUser.staffData.role}</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}