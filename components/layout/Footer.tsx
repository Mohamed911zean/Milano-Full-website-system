"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

const NAVIGATION = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/specialCake", label: "الكيك الخاص" },
  { href: "/about", label: "من نحن" },
  { href: "/branches", label: "الفروع" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-bg-base pt-32">
      {/* Ambient Light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold-border to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold-subtle blur-[140px]" />

      <div className="container relative z-10">
        {/* Top Area */}
        <div className="mb-28 grid gap-20 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          {/* Brand Side */}
          <div className="max-w-xl">
            <div className="mb-10">
              <span className="mb-6 inline-flex items-center rounded-full border border-gold-border bg-gold-subtle px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-light">
                Premium Patisserie
              </span>

              <h2 className="font-display text-[72px] leading-[0.9] tracking-[-0.08em] text-text-primary md:text-[110px]">
                MILANO
              </h2>

              <div className="mt-6 h-px w-32 bg-gradient-to-r from-gold-border to-transparent" />
            </div>

            <p className="max-w-md text-[15px] leading-[2] text-text-muted">
              نقدم تجربة حلويات فاخرة تمزج بين الحرفية
              الإيطالية والذوق العصري، مع تفاصيل مصنوعة
              بعناية تمنح كل زيارة طابعاً استثنائياً.
            </p>

            {/* Social */}
            <div className="mt-10 flex items-center gap-4">
              <a
                href="#"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-text-secondary transition-all duration-premium ease-premium hover:-translate-y-1 hover:border-border-active hover:bg-bg-elevated hover:text-gold"
              >
                <FaInstagram className="text-[15px] transition-transform duration-premium group-hover:scale-110" />
              </a>

              <a
                href="#"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-text-secondary transition-all duration-premium ease-premium hover:-translate-y-1 hover:border-border-active hover:bg-bg-elevated hover:text-gold"
              >
                <FaFacebookF className="text-[15px] transition-transform duration-premium group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-text-fade">
              Navigation
            </h3>

            <ul className="space-y-5">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between text-[15px] text-text-secondary transition-colors duration-premium hover:text-gold"
                  >
                    <span>{item.label}</span>

                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-premium group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-text-fade">
              Contact
            </h3>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-gold">
                  <Phone className="h-[17px] w-[17px]" />
                </div>

                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-text-fade">
                    Hotline
                  </p>

                  <a
                    href="tel:01013689991"
                    dir="ltr"
                    className="text-[15px] text-text-secondary transition-colors duration-premium hover:text-gold"
                  >
                    01013689991
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-gold">
                  <Clock3 className="h-[17px] w-[17px]" />
                </div>

                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-text-fade">
                    Working Hours
                  </p>

                  <p className="text-[15px] text-text-secondary">
                    Daily · 10AM — 12AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-gold">
                  <MapPin className="h-[17px] w-[17px]" />
                </div>

                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-text-fade">
                    Branches
                  </p>

                  <p className="text-[15px] text-text-secondary">
                    Mansoura · Talkha · Belqas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-5 py-8 md:flex-row">
          <p className="text-[12px] tracking-[0.12em] text-text-fade">
            © 2026 MILANO · ALL RIGHTS RESERVED
          </p>

          <div className="flex items-center gap-8">
            <Link
              href="/privacy-policy"
              className="text-[12px] uppercase tracking-[0.16em] text-text-fade transition-colors duration-premium hover:text-gold"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[12px] uppercase tracking-[0.16em] text-text-fade transition-colors duration-premium hover:text-gold"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
``
