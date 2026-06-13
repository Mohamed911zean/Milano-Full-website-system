// app/(admin)/admin/activity/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Activity, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getActivityData(page: number) {
    const supabase = await createClient()
    const pageSize = 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: activityLog, count } = await supabase
        .from('staff_activity_log')
        .select('*, staff:staff_profiles(full_name, role)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    return {
        activityLog: activityLog ?? [],
        totalPages: Math.ceil((count ?? 0) / pageSize)
    }
}

export default async function AdminActivityPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    // 🔒 operations ممنوع من هنا
    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!staff || !['owner', 'super_admin'].includes(staff.role)) {
        redirect('/admin/dashboard')
    }

    const page = parseInt(searchParams.page ?? '1', 10)
    const { activityLog, totalPages } = await getActivityData(page)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">سجل النشاط</h2>
                    <p className="text-xs text-white/40 mt-0.5">متابعة نشاط الموظفين في لوحة التحكم</p>
                </div>
            </div>

            <div className="space-y-3">
                {activityLog.length === 0 ? (
                    <div className="text-center py-20 text-white/20 text-sm bg-[#111113] border border-white/[0.06] rounded-2xl">
                        لا يوجد نشاط مسجل بعد
                    </div>
                ) : (
                    activityLog.map(log => (
                        <div key={log.id} className="flex items-start gap-4 bg-[#111113] border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center h-10">
                                <p className="text-sm font-medium text-white/80">{log.action}</p>
                                <p className="text-xs text-white/40 mt-1">الموظف: <span className="text-[#c9a84c]">{log.staff?.full_name ?? 'غير معروف'}</span></p>
                            </div>
                            <div className="flex items-center h-10">
                                <p className="text-xs text-white/25 whitespace-nowrap bg-white/5 px-3 py-1.5 rounded-lg border border-white/[0.02]">
                                    {new Date(log.created_at).toLocaleString('ar-EG', {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    {page > 1 ? (
                        <Link href={`?page=${page - 1}`} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" /> السابق
                        </Link>
                    ) : <div className="w-[70px]" />}
                    <span className="text-sm text-white/50 font-mono">{page} / {totalPages}</span>
                    {page < totalPages ? (
                        <Link href={`?page=${page + 1}`} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                            التالي <ChevronLeft className="w-4 h-4" />
                        </Link>
                    ) : <div className="w-[70px]" />}
                </div>
            )}
        </div>
    )
}