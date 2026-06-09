import { createClient } from '@/lib/supabase/server'
import StaffClientPage from './ClientPage'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminStaffPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    const [
        { data: currentUserStaff },
        { data: staffList },
    ] = await Promise.all([
        supabase.from('staff_profiles').select('role').eq('id', user.id).single(),
        supabase.from('staff_profiles').select('*').order('created_at', { ascending: false })
    ])

    const isOwner = currentUserStaff?.role === 'owner'

    return (
        <StaffClientPage 
            initialStaff={staffList ?? []} 
            currentUserId={user.id}
            isOwner={isOwner}
        />
    )
}
