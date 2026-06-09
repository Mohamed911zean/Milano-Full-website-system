'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface AdminSidebarContextType {
    isOpen: boolean        // desktop expanded/collapsed
    isMobileOpen: boolean  // mobile drawer open
    isMobile: boolean      // is current viewport mobile
    toggleDesktop: () => void
    openMobile: () => void
    closeMobile: () => void
    toggleMobile: () => void
}

const AdminSidebarContext = createContext<AdminSidebarContextType | null>(null)

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile breakpoint
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1023px)')
        const handler = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches)
            if (e.matches) setIsMobileOpen(false)
        }
        handler(mq)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    // Close mobile drawer on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileOpen(false)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isMobileOpen])

    const toggleDesktop = useCallback(() => setIsOpen(p => !p), [])
    const openMobile = useCallback(() => setIsMobileOpen(true), [])
    const closeMobile = useCallback(() => setIsMobileOpen(false), [])
    const toggleMobile = useCallback(() => setIsMobileOpen(p => !p), [])

    return (
        <AdminSidebarContext.Provider value={{
            isOpen, isMobileOpen, isMobile,
            toggleDesktop, openMobile, closeMobile, toggleMobile
        }}>
            {children}
        </AdminSidebarContext.Provider>
    )
}

export function useAdminSidebar() {
    const ctx = useContext(AdminSidebarContext)
    if (!ctx) throw new Error('useAdminSidebar must be used within AdminSidebarProvider')
    return ctx
}
