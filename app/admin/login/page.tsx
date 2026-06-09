'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Lock, Mail, ShieldAlert } from 'lucide-react'

export default function AdminLoginPage() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError || !data.user) {
            setError('بيانات الدخول غير صحيحة')
            setLoading(false)
            return
        }

        // تحقق من إنه super_admin أو owner
        const { data: staff } = await supabase
            .from('staff_profiles')
            .select('role, is_active, full_name')
            .eq('id', data.user.id)
            .single()

        if (!staff || !staff.is_active || !['owner', 'super_admin'].includes(staff.role)) {
            await supabase.auth.signOut()
            setError('ليس لديك صلاحية الوصول للوحة التحكم')
            setLoading(false)
            return
        }

        router.push('/admin/dashboard')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6"
             style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)' }}>
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a1508] border border-[#c9a84c]/20 mb-4">
                        <ShieldAlert className="w-7 h-7 text-[#c9a84c]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Milano Admin</h1>
                    <p className="text-sm text-white/40 mt-1">Super Admin Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-widest">البريد الإلكتروني</label>
                        <div className="relative">
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                   className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pl-11 text-sm text-white placeholder:text-white/20 focus:border-[#c9a84c]/50 focus:bg-white/8 outline-none transition-all"
                                   placeholder="admin@milano.eg" />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-widest">كلمة المرور</label>
                        <div className="relative">
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                   className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pl-11 text-sm text-white placeholder:text-white/20 focus:border-[#c9a84c]/50 focus:bg-white/8 outline-none transition-all"
                                   placeholder="••••••••" />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                            className="w-full h-12 bg-[#c9a84c] hover:bg-[#d4b86a] text-[#0a0502] font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'دخول لوحة التحكم'}
                    </button>
                </form>
            </div>
        </div>
    )
}