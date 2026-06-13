// app/(admin)/admin/staff/page.tsx
import { createClient } from '@/lib/supabase/server'
import StaffClientPage from './ClientPage'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminStaffPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    // 🔒 operations ممنوع من هنا
    const { data: currentUserStaff } = await supabase
        .from('staff_profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

    if (!currentUserStaff || !['owner', 'super_admin'].includes(currentUserStaff.role)) {
        redirect('/admin/dashboard')
    }

    const { data: staffList } = await supabase
        .from('staff_profiles')
        .select('*')
        .order('created_at', { ascending: false })

    const isOwner = currentUserStaff.role === 'owner'

    return (
        <StaffClientPage
            initialStaff={staffList ?? []}
            currentUserId={user.id}
            isOwner={isOwner}
        />
    )
}