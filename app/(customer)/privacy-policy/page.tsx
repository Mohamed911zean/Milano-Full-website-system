import React from 'react';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-bg-base relative overflow-hidden pt-24 pb-32">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <nav className="text-[10px] uppercase tracking-[0.3em] text-gold mb-12">
              Home <span className="mx-2 opacity-20 text-text-primary">/</span> Privacy Policy
            </nav>
            
            <header className="mb-20">
              <h1 className="text-h1 text-text-primary font-display uppercase tracking-widest mb-6">Privacy <span className="text-gold">Policy</span></h1>
              <p className="text-text-muted text-sm tracking-wide">Last updated: May 2026</p>
              <div className="w-20 h-[1px] bg-gold/30 mt-8" />
            </header>
            
            <div className="space-y-16">
              <section className="bg-bg-card/30 backdrop-blur-md border border-gold-border/10 rounded-[2rem] p-10 shadow-card">
                <p className="text-text-secondary leading-relaxed tracking-wide text-sm">
                  At Lenza Patisserie, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or use our services.
                </p>
              </section>

              <section className="space-y-8">
                <h2 className="text-xl font-display text-text-primary uppercase tracking-[0.1em] flex items-center gap-4">
                  <span className="text-gold opacity-50">01.</span> Information We Collect
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Personal Information", desc: "Name, email, phone, and delivery address for order processing." },
                    { title: "Payment Information", desc: "Secure third-party processing. We do not store full credit card details." },
                    { title: "Usage Data", desc: "Interactions with our website, IP address, and browser type." },
                    { title: "Cookies", desc: "Enhanced browsing experience and preference memory." }
                  ].map((item, i) => (
                    <div key={i} className="p-8 rounded-2xl bg-bg-card/20 border border-gold-border/5 hover:border-gold-border/20 transition-all duration-500">
                      <h4 className="text-[11px] uppercase tracking-widest text-gold font-black mb-3">{item.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed tracking-wide">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-display text-text-primary uppercase tracking-[0.1em] flex items-center gap-4">
                  <span className="text-gold opacity-50">02.</span> How We Use Your Information
                </h2>
                <p className="text-text-secondary leading-relaxed tracking-wide text-sm max-w-3xl">
                  We use the information we collect to process your orders, communicate with you about your delivery, improve our services, and send you promotional offers if you have opted in to our newsletter.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-display text-text-primary uppercase tracking-[0.1em] flex items-center gap-4">
                  <span className="text-gold opacity-50">03.</span> Data Sharing and Disclosure
                </h2>
                <p className="text-text-secondary leading-relaxed tracking-wide text-sm max-w-3xl">
                  We do not sell your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-display text-text-primary uppercase tracking-[0.1em] flex items-center gap-4">
                  <span className="text-gold opacity-50">04.</span> Data Security
                </h2>
                <p className="text-text-secondary leading-relaxed tracking-wide text-sm max-w-3xl">
                  We implement a variety of security measures to maintain the safety of your personal information. Your data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-display text-text-primary uppercase tracking-[0.1em] flex items-center gap-4">
                  <span className="text-gold opacity-50">05.</span> Your Rights
                </h2>
                <p className="text-text-secondary leading-relaxed tracking-wide text-sm max-w-3xl">
                  You have the right to access, correct, or delete your personal information at any time. You can also object to the processing of your data or request a copy of the information we hold about you.
                </p>
              </section>

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
