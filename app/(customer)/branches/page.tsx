"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock3,
  MapPin,
  Phone,
  Search,
  ExternalLink,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";

const BRANCHES = [
  {
    city: "المنصورة",
    branch: "فرع قناة السويس",
    address: "شارع قناة السويس",
    phones: ["01000803760"],
  },
  {
    city: "طلخا",
    branch: "فرع شارع صلاح سالم",
    address: "شارع صلاح سالم",
    phones: ["01091555498"],
  },
  {
    city: "طلخا",
    branch: "فرع البحر الأعظم",
    address: "شارع البحر الأعظم",
    phones: ["01001919467"],
  },
  {
    city: "بلقاس",
    branch: "فرع بلقاس",
    address: "شارع أبو رجيلة أمام عمر أفندي",
    phones: ["01094290714", "0502544388"],
  },
  {
    city: "شربين",
    branch: "فرع شربين",
    address: "شارع الجيش بجوار السنترال العمومي",
    phones: ["01067777330", "01080408822"],
  },
];

const CITIES = [
  "الكل",
  "المنصورة",
  "طلخا",
  "بلقاس",
  "شربين",
];

export default function BranchesPage() {
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [search, setSearch] = useState("");

  const filteredBranches = useMemo(() => {
    return BRANCHES.filter((branch) => {
      const cityMatch =
        selectedCity === "الكل" ||
        branch.city === selectedCity;

      const searchMatch =
        !search ||
        branch.branch.includes(search) ||
        branch.address.includes(search);

      return cityMatch && searchMatch;
    });
  }, [selectedCity, search]);

  return (
    <>
      <section className="relative overflow-hidden bg-bg-base pt-32 pb-40">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold-subtle blur-[140px]" />

        <div className="container relative z-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-24 max-w-3xl text-center"
          >
            <span className="mb-6 inline-flex rounded-full border border-gold-border bg-gold-subtle px-5 py-2 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              فروع ميلانو
            </span>

            <h1 className="text-h1 text-text-primary">
              أقرب فرع إليك
            </h1>

            <p className="mt-6 text-[15px] leading-[2] text-text-muted">
              جميع فروع ميلانو تعمل يومياً من الساعة
              10 صباحاً حتى 12 مساءً مع خدمة
              دليفري داخل المنصورة وطلخا.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-20 grid gap-6 rounded-[28px] border border-border-subtle bg-bg-card/80 p-6 backdrop-blur-xl lg:grid-cols-[1fr_340px]">
            {/* Cities */}
            <div className="flex flex-wrap gap-3">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-5 py-3 text-[12px] font-semibold transition-all duration-premium ${
                    selectedCity === city
                      ? "bg-gold text-text-on-gold shadow-gold"
                      : "border border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-active hover:text-gold"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-fade" />

              <input
                type="text"
                placeholder="ابحث عن فرع أو منطقة"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 w-full rounded-full border border-border-subtle bg-bg-elevated pr-14 pl-6 text-sm text-text-primary outline-none transition-all duration-premium placeholder:text-text-fade focus:border-border-active"
              />
            </div>
          </div>

          {/* Branches */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={branch.branch}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group relative overflow-hidden rounded-[30px] border border-border-subtle bg-bg-card p-8 transition-all duration-premium hover:-translate-y-1 hover:border-border-active hover:shadow-hover"
              >
                {/* subtle glow */}
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gold-subtle blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                {/* City */}
                <span className="mb-6 inline-flex rounded-full border border-gold-border bg-gold-subtle px-4 py-2 text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                  {branch.city}
                </span>

                {/* Title */}
                <h3 className="mb-8 font-display text-[30px] leading-tight text-text-primary transition-colors duration-premium group-hover:text-gold">
                  {branch.branch}
                </h3>

                {/* Info */}
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                      <MapPin className="h-[17px] w-[17px]" />
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-fade">
                        العنوان
                      </p>

                      <p className="text-[15px] leading-loose text-text-secondary">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  {/* Phones */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                      <Phone className="h-[17px] w-[17px]" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-text-fade">
                        أرقام التواصل
                      </p>

                      {branch.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          dir="ltr"
                          className="block text-[15px] text-text-secondary transition-colors duration-premium hover:text-gold"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-gold">
                      <Clock3 className="h-[17px] w-[17px]" />
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-fade">
                        مواعيد العمل
                      </p>

                      <p className="text-[15px] text-text-secondary">
                        يومياً 10 صباحاً — 12 مساءً
                      </p>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${branch.address} ${branch.city} مصر`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 flex h-14 items-center justify-center gap-3 rounded-full border border-gold-border bg-bg-elevated text-sm font-semibold text-text-primary transition-all duration-premium hover:border-border-active hover:bg-gold hover:text-text-on-gold"
                >
                  عرض الاتجاهات
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>

          {/* Delivery Section */}
          <div className="mt-24 rounded-[32px] border border-border-subtle bg-bg-card p-10 md:p-14">
            <div className="max-w-2xl">
              <span className="mb-5 inline-flex rounded-full border border-gold-border bg-gold-subtle px-4 py-2 text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
                خدمة التوصيل
              </span>

              <h2 className="mb-6 text-h2 text-text-primary">
                دليفري داخل المنصورة وطلخا
              </h2>

              <p className="mb-8 text-[15px] leading-[2] text-text-muted">
                خدمة التوصيل متاحة يومياً من الساعة
                12 ظهراً حتى 12 مساءً.
              </p>

              <a
                href="tel:01013689991"
                dir="ltr"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gold px-8 text-sm font-bold text-text-on-gold transition-all duration-premium hover:scale-[1.02] hover:shadow-gold"
              >
                01013689991
              </a>
            </div>
          </div>

          {/* Main Management */}
          <div className="mt-10 rounded-[32px] border border-border-subtle bg-bg-card p-10">
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-text-fade">
              الإدارة الرئيسية
            </p>

            <a
              href="tel:01050040098"
              dir="ltr"
              className="font-display text-[32px] text-text-primary transition-colors duration-premium hover:text-gold"
            >
              01050040098
            </a>
          </div>
        </div>
      </section>

    </>
  );
}

