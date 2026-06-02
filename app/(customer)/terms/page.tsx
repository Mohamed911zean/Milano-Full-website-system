import React from 'react';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <div className="bg-bg-base relative overflow-hidden pt-24 pb-32">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <nav className="text-[10px] uppercase tracking-[0.3em] text-gold mb-12">
              Home <span className="mx-2 opacity-20 text-text-primary">/</span> Terms & Conditions
            </nav>
            
            <header className="mb-20">
              <h1 className="text-h1 text-text-primary font-display uppercase tracking-widest mb-6">Terms & <span className="text-gold">Conditions</span></h1>
              <p className="text-text-muted text-sm tracking-wide">Last updated: May 2026</p>
              <div className="w-20 h-[1px] bg-gold/30 mt-8" />
            </header>
            
            <div className="space-y-16">
              {[
                { 
                  id: "01", 
                  title: "Order Placement", 
                  content: "By placing an order on our website, you agree to provide accurate and complete information. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, errors in pricing, or suspected fraud." 
                },
                { 
                  id: "02", 
                  title: "Pricing & Payment", 
                  content: "All prices are listed in EGP and are inclusive of VAT where applicable. Payment must be made in full at the time of ordering or upon delivery if cash on delivery is selected. We use secure payment gateways for all online transactions." 
                },
                { 
                  id: "03", 
                  title: "Delivery Policy", 
                  content: "We offer delivery services daily from 10:00 AM to 9:00 PM. While we make every effort to accommodate specific delivery time requests, we cannot guarantee an exact time. Delivery fees vary based on location and will be calculated at checkout." 
                },
                { 
                  id: "04", 
                  title: "Returns & Refunds", 
                  content: "Due to the perishable nature of our products, issues must be reported on the same day as delivery, accompanied by a photo of the product. Claims made after 24 hours will not be eligible for a refund or replacement." 
                },
                { 
                  id: "05", 
                  title: "Product Representation", 
                  content: "Images on our website are for illustrative purposes only. The final product may vary slightly in appearance due to its handcrafted nature and seasonal availability of ingredients." 
                },
                { 
                  id: "06", 
                  title: "Intellectual Property", 
                  content: "All content on this website, including text, images, logos, and designs, is the property of Lenza Patisserie and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our prior written consent." 
                }
              ].map((section, i) => (
                <section key={i} className="space-y-6">
                  <h2 className="text-xl font-display text-text-primary uppercase tracking-[0.1em] flex items-center gap-4">
                    <span className="text-gold opacity-50">{section.id}.</span> {section.title}
                  </h2>
                  <div className="bg-bg-card/20 backdrop-blur-sm border border-gold-border/5 rounded-2xl p-8 hover:border-gold-border/20 transition-all duration-500">
                    <p className="text-text-secondary leading-relaxed tracking-wide text-sm">
                      {section.content}
                    </p>
                  </div>
                </section>
              ))}

              <section className="pt-20 border-t border-gold-border/10 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-fade mb-6">Concierge Inquiries</p>
                <a href="mailto:info@lenza.com" className="text-2xl font-display text-gold hover:text-gold-light transition-all duration-500 tracking-wider">
                  info@lenza.com
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
