"use client"

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber: string
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  // Remove any non-digit characters from the phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  // Add country code if not present (assuming Egypt +20)
  const formattedNumber = cleanNumber.startsWith('20') ? cleanNumber : `20${cleanNumber}`
  
  const whatsappUrl = `https://wa.me/${formattedNumber}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 animate-pulse-subtle"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
      </span>
    </a>
  )
}
