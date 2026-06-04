'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, Plus, Send, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/Typography';
import { createSupportTicket, type CreateTicketInput } from '@/lib/services/support';
import { OrderWithItems } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved' | 'closed' | string;
  created_at: string;
};

interface Props {
  initialTickets: SupportTicket[];
  orders: OrderWithItems[];
}

export default function SupportClient({ initialTickets, orders }: Props) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const input: CreateTicketInput = {
        subject,
        message,
        orderId: orderId || undefined,
        priority,
      };

      const newTicket = await createSupportTicket(input);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setShowNewTicket(false);
        setSubject('');
        setMessage('');
        setOrderId('');
        setTickets(prev => [newTicket, ...prev]);
      }, 2000);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Failed to submit support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <SectionLabel>مركز المساعدة</SectionLabel>
          <h1 className="text-4xl font-display font-bold text-white">الدعم الفني</h1>
        </div>
        <Button onClick={() => setShowNewTicket(true)} className="h-14">
          <Plus className="w-5 h-5 ml-2" /> تذكرة جديدة
        </Button>
      </header>

      <div className="space-y-6">
        {tickets.length === 0 ? (
          <div className="glass-card rounded-3xl p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center text-gold mx-auto">
              <LifeBuoy className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">لا توجد تذاكر دعم</h3>
              <p className="text-text-muted text-sm font-light">إذا واجهتك أي مشكلة، نحن هنا للمساعدة</p>
            </div>
          </div>
        ) : (
          tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 md:p-8 space-y-4 group hover:border-gold-border transition-all duration-500"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                      ticket.status === 'open'
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : ticket.status === 'resolved'
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-text-fade/10 text-text-fade border-white/5"
                    )}>
                      {ticket.status === 'open' ? 'مفتوحة' : ticket.status === 'resolved' ? 'تم الحل' : 'مغلقة'}
                    </span>
                    <span className="text-[10px] text-text-fade font-bold tracking-widest uppercase">
                      #{ticket.id?.slice(0, 8)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                    {ticket.subject}
                  </h3>
                </div>
                <span className="text-[10px] text-text-fade font-medium uppercase tracking-widest">
                  {new Date(ticket.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
              <p className="text-text-muted text-sm font-light leading-relaxed">{ticket.message}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-base/80 backdrop-blur-md"
              onClick={() => !submitting && setShowNewTicket(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-bg-card border border-gold-border/20 rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-gold opacity-50" />

              <button
                onClick={() => setShowNewTicket(false)}
                className="absolute top-6 right-6 text-text-fade hover:text-gold transition-colors"
                disabled={submitting}
              >
                <X className="w-6 h-6" />
              </button>

              {success ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-white">تم إرسال التذكرة بنجاح</h3>
                    <p className="text-text-muted text-sm font-light">سيقوم فريق الدعم بالرد عليك في أقرب وقت ممكن</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 text-right">
                  <div className="space-y-2">
                    <SectionLabel className="mb-2">تذكرة دعم جديدة</SectionLabel>
                    <h2 className="text-3xl font-display font-bold text-white">كيف يمكننا مساعدتك؟</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">الموضوع</label>
                      <input
                        required
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="مثلاً: تأخير في التوصيل"
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-sm text-white focus:border-gold outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">رقم الطلب (اختياري)</label>
                      <select
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-sm text-white focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">لا يوجد</option>
                        {orders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.order_number} - {new Date(order.created_at).toLocaleDateString('ar-EG')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-fade font-bold px-1">الرسالة</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اشرح لنا المشكلة بالتفصيل..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white focus:border-gold outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] uppercase tracking-widest text-text-fade font-bold">الأولوية:</span>
                      <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                        {(['low', 'medium', 'high'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                              priority === p
                                ? "bg-gold text-text-on-gold shadow-sm"
                                : "text-text-fade hover:text-white"
                            )}
                          >
                            {p === 'low' ? 'منخفضة' : p === 'medium' ? 'متوسطة' : 'عالية'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" disabled={submitting} className="h-14 px-12">
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          إرسال <Send className="w-4 h-4 mr-2 rotate-180" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
