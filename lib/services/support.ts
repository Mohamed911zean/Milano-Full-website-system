// lib/services/support.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export interface CreateTicketInput {
  subject: string
  message: string
  orderId?: string
  priority: 'low' | 'medium' | 'high'
}

export async function createSupportTicket(input: CreateTicketInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('غير مصرح لك')

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      user_id: user.id,
      order_id: input.orderId || null,
      subject: input.subject,
      message: input.message,
      priority: input.priority,
      status: 'open'
    })
    .select()
    .single()

  if (error) throw new Error(`فشل في إنشاء التذكرة: ${error.message}`)
  return data
}

export async function getUserTickets() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`فشل في جلب التذاكر: ${error.message}`)
  return data || []
}