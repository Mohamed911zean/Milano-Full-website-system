import { Navbar } from '@/components/layout/Navbar'
import  {Footer}  from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { LocationModal } from '@/components/layout/LocationModal'
import { CartProvider } from '@/context/CartContext'
import { LocationProvider } from '@/context/LocationContext'

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
