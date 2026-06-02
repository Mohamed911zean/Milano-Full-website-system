
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  Check,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";

export default function ContactUsPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const [message, setMessage] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-bg-base pt-32 pb-40">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold-subtle blur-[160px]" />

        <div className="container relative z-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-24 max-w-3xl text-center"
          >
            <span className="mb-6 inline-flex rounded-full border border-gold-border bg-gold-subtle px-5 py-2 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              تواصل معنا
            </span>

            <h1 className="text-h1 text-text-primary">
              نحن هنا لخدمتك
            </h1>

            <p className="mt-6 text-[15px] leading-[2] text-text-muted">
              لأي استفسار عن الطلبات أو الفروع أو
              خدمات التوصيل، يمكنكم التواصل معنا
              مباشرة وسيقوم فريق ميلانو بالرد عليكم
              في أقرب وقت.
            </p>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Main Contact */}
              <div className="rounded-[32px] border border-border-subtle bg-bg-card p-10">
                <span className="mb-6 inline-flex rounded-full border border-gold-border bg-gold-subtle px-4 py-2 text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                  معلومات التواصل
                </span>

                <div className="space-y-8">
                  {/* Main */}
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                      <Phone className="h-[18px] w-[18px]" />
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-text-fade">
                        الإدارة الرئيسية
                      </p>

                      <a
                        href="tel:01050040098"
                        dir="ltr"
                        className="font-display text-[28px] text-text-primary transition-colors duration-premium hover:text-gold"
                      >
                        01050040098
                      </a>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                      <Send className="h-[18px] w-[18px]" />
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-text-fade">
                        خدمة الدليفري
                      </p>

                      <a
                        href="tel:01013689991"
                        dir="ltr"
                        className="font-display text-[28px] text-text-primary transition-colors duration-premium hover:text-gold"
                      >
                        01013689991
                      </a>

                      <p className="mt-3 text-[14px] leading-loose text-text-muted">
                        متاح يومياً داخل المنصورة
                        وطلخا من 12 ظهراً حتى
                        12 مساءً.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-[32px] border border-border-subtle bg-bg-card p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                    <Clock3 className="h-[18px] w-[18px]" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-text-fade">
                      مواعيد العمل
                    </p>

                    <h3 className="mt-1 text-[26px] font-display text-text-primary">
                      يومياً
                    </h3>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between rounded-2xl border border-border-subtle bg-bg-elevated px-6 py-5">
                    <span className="text-[14px] text-text-secondary">
                      الفروع
                    </span>

                    <span className="text-[14px] font-semibold text-text-primary">
                      10 صباحاً — 12 مساءً
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-border-subtle bg-bg-elevated px-6 py-5">
                    <span className="text-[14px] text-text-secondary">
                      الدليفري
                    </span>

                    <span className="text-[14px] font-semibold text-text-primary">
                      12 ظهراً — 12 مساءً
                    </span>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="rounded-[32px] border border-border-subtle bg-bg-card p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                    <MapPin className="h-[18px] w-[18px]" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-text-fade">
                      فروعنا
                    </p>

                    <h3 className="mt-1 text-[26px] font-display text-text-primary">
                      في انتظاركم
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    "المنصورة",
                    "طلخا",
                    "بلقاس",
                    "شربين",
                  ].map((city) => (
                    <div
                      key={city}
                      className="rounded-full border border-border-subtle bg-bg-elevated px-5 py-3 text-[13px] text-text-secondary"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative overflow-hidden rounded-[40px] border border-border-subtle bg-bg-card p-8 md:p-12"
            >
              {/* subtle top line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-border to-transparent" />

              {status === "success" ? (
                <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                  <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                    <Check className="h-10 w-10" />
                  </div>

                  <h3 className="mb-4 text-[42px] font-display text-text-primary">
                    تم الإرسال
                  </h3>

                  <p className="max-w-md text-[15px] leading-[2] text-text-muted">
                    شكراً لتواصلكم مع ميلانو،
                    سيقوم فريقنا بالرد عليكم
                    في أقرب وقت ممكن.
                  </p>

                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-10 h-14 rounded-full border border-border-subtle bg-bg-elevated px-8 text-sm font-semibold text-text-primary transition-all duration-premium hover:border-border-active hover:text-gold"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Heading */}
                  <div>
                    <span className="mb-4 inline-flex rounded-full border border-gold-border bg-gold-subtle px-4 py-2 text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                      أرسل رسالة
                    </span>

                    <h2 className="text-h2 text-text-primary">
                      كيف يمكننا مساعدتك؟
                    </h2>

                    <p className="mt-4 max-w-lg text-[15px] leading-[2] text-text-muted">
                      اكتب استفسارك أو طلبك
                      وسيقوم فريق ميلانو
                      بالتواصل معك مباشرة.
                    </p>
                  </div>

                  {/* Inputs */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-text-fade">
                        الاسم بالكامل
                      </label>

                      <input
                        type="text"
                        required
                        placeholder="محمد أحمد"
                        className="h-14 w-full rounded-2xl border border-border-subtle bg-bg-elevated px-6 text-sm text-text-primary outline-none transition-all duration-premium placeholder:text-text-fade focus:border-border-active"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-text-fade">
                        رقم الهاتف
                      </label>

                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="01xxxxxxxxx"
                        className="h-14 w-full rounded-2xl border border-border-subtle bg-bg-elevated px-6 text-sm text-text-primary outline-none transition-all duration-premium placeholder:text-text-fade focus:border-border-active"
                      />
                    </div>
                  </div>

                  {/* Textarea */}
                  <div>
                    <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-text-fade">
                      الرسالة
                    </label>

                    <textarea
                      rows={7}
                      required
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full rounded-[28px] border border-border-subtle bg-bg-elevated px-6 py-5 text-sm leading-loose text-text-primary outline-none transition-all duration-premium placeholder:text-text-fade focus:border-border-active resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-gold text-sm font-bold text-text-on-gold transition-all duration-premium hover:scale-[1.01] hover:shadow-gold disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        إرسال الرسالة
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
}

