"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/store/cart'
import { cn } from '@/lib/utils'
import CartDrawer from './CartDrawer'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنتجات' },
  { href: '/track-order', label: 'تتبع طلبك' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const itemCount = totalItems()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-dark-surface/90 backdrop-blur-md border-b border-dark-border py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-display text-3xl font-bold text-gold hover:text-gold-light transition-colors"
          >
            Milano
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-gold',
                  pathname === link.href ? 'text-gold' : 'text-text-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 text-text-primary hover:text-gold transition-colors"
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-dark-base">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-primary hover:text-gold transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-64 mt-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-4 py-4 border-t border-dark-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-lg font-medium transition-colors hover:text-gold px-2',
                  pathname === link.href ? 'text-gold' : 'text-text-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}
