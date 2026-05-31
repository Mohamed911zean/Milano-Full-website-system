import { OrderStatus } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react'

interface OrderTimelineProps {
  currentStatus: OrderStatus
}

const steps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'new', label: 'طلب جديد', icon: Clock },
  { status: 'confirmed', label: 'تم التأكيد', icon: Check },
  { status: 'in_preparation', label: 'قيد التحضير', icon: Package },
  { status: 'ready', label: 'جاهز', icon: CheckCircle2 },
  { status: 'out_for_delivery', label: 'في الطريق', icon: Truck },
  { status: 'delivered', label: 'تم التوصيل', icon: CheckCircle2 },
]

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500">
        <XCircle className="w-12 h-12" />
        <p className="font-bold text-lg">تم إلغاء هذا الطلب</p>
      </div>
    )
  }

  const currentIdx = steps.findIndex((s) => s.status === currentStatus)

  return (
    <div className="relative space-y-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx
        const isCurrent = idx === currentIdx
        const Icon = step.icon

        return (
          <div key={step.status} className="flex gap-6 items-start group">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  isCompleted ? "bg-gold border-gold text-dark-base" : 
                  isCurrent ? "bg-dark-base border-gold text-gold shadow-[0_0_15px_rgba(201,168,76,0.3)] animate-pulse" : 
                  "bg-dark-base border-dark-border text-text-disabled"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              {idx !== steps.length - 1 && (
                <div 
                  className={cn(
                    "w-0.5 h-12 transition-all duration-500",
                    isCompleted ? "bg-gold" : "bg-dark-border"
                  )} 
                />
              )}
            </div>
            <div className="pt-2">
              <h4 
                className={cn(
                  "font-bold transition-colors",
                  isCurrent ? "text-gold text-lg" : isCompleted ? "text-text-primary" : "text-text-disabled"
                )}
              >
                {step.label}
              </h4>
              {isCurrent && (
                <p className="text-text-muted text-sm mt-1 animate-in fade-in slide-in-from-right-4">
                  طلبك الآن في مرحلة {step.label}، سيتم تحديثك فور الانتقال للمرحلة التالية.
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
