import type { Metadata } from "next";
import { Cairo, Playfair_Display } from "next/font/google";

import {Rouge_Script} from "next/font/google"

import { Noto_Nastaliq_Urdu } from 'next/font/google';
import { Fustat } from "next/font/google";

import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Milano Sweets | حلويات ميلانو",
  description: "حلويات راقية من قلب المنصورة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.className} ${playfair.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-base text-text-primary selection:bg-gold/30">
        {children}
      </body>
    </html>
  );
}
