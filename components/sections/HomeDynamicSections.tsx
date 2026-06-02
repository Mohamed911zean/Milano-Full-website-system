'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicProductGrid = dynamic(() => import("@/components/sections/DynamicProductGrid").then(mod => mod.DynamicProductGrid), {
  loading: () => <div className="section bg-bg-base h-[600px] flex items-center justify-center"><div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>,
  ssr: false
});

const Newsletter = dynamic(() => import("@/components/sections/Newsletter").then(mod => mod.Newsletter), {
  ssr: false
});

export function HomeDynamicSections() {
  return (
    <>
      <DynamicProductGrid />
      <Newsletter />
    </>
  );
}
