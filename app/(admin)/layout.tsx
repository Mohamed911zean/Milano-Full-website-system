// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

    if (!staff || !staff.is_active || !['owner', 'super_admin'].includes(staff.role)) {
        redirect('/admin/login')
    }

    return <>{children}</>
}