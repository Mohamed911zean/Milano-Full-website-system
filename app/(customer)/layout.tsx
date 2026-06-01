import Navbar from '@/components/customer/Navbar'
import Footer from '@/components/customer/Footer'
import WhatsAppButton from '@/components/customer/WhatsAppButton'
import { getShopConfig } from '@/lib/services/config'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getShopConfig()

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer config={config} />
      <WhatsAppButton phoneNumber={config.whatsapp_number} />
    </>
  )
}