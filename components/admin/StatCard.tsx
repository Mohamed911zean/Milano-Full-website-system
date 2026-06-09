import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

export function StatCard({ label, value, sub, icon: Icon, accent }: {
    label: string; value: string | number; sub?: string
    icon: React.ElementType; accent: string
}) {
    return (
        <div className="relative overflow-hidden bg-[#111113] border border-white/[0.06] rounded-2xl p-5 group hover:border-white/10 transition-all duration-300">
            <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity', accent)} />
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', accent.replace('bg-', 'bg-').replace('/20', '/15'))}>
                    <Icon className="w-4 h-4 text-white/70" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-white relative z-10">{typeof value === 'number' ? value.toLocaleString('ar-EG') : value}</p>
            <p className="text-xs text-white/40 mt-1 relative z-10">{label}</p>
            {sub && <p className="text-[10px] text-white/25 mt-0.5 relative z-10">{sub}</p>}
        </div>
    )
}
