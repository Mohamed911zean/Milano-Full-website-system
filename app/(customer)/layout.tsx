import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { LocationModal } from '@/components/layout/LocationModal'
import { CartProvider } from '@/context/CartContext'
import { LocationProvider } from '@/context/LocationContext'
import { Rouge_Script } from "next/font/google"

import { Noto_Nastaliq_Urdu } from 'next/font/google';
import { Fustat } from "next/font/google";

const font_fustat = Fustat({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-fustat',
})

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-urdu',
});

const rougeScript = Rouge_Script({
  subsets: ['latin'],
  weight: '400',
})

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LocationProvider>
      <CartProvider>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <LocationModal />
      </CartProvider>
    </LocationProvider>
  )
}
