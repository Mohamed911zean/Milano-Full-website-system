import { HeroSlider } from "@/components/sections/HeroSlider";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { SpecialCakeCTA } from "@/components/sections/SpecialCakeCTA";
import { ProductSpotlight } from "@/components/sections/ProductSpotlight";
import { LegacyStats } from "@/components/sections/LegacyStats";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BranchesCTA } from "@/components/sections/BranchesCTA";
import { getActiveCategories } from "@/lib/services/products";

export default async function Home() {
  // Categories من Supabase
  const categories = await getActiveCategories();

  return (
    <div className="relative overflow-hidden">
      <HeroSlider />

      {/* Gap section */}
      <div className="py-24 flex flex-col gap-24">
        <CategoriesSection categories={categories} />

        <div className="container mx-auto px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gold-border to-transparent" />
        </div>

        <SpecialCakeCTA />
        <ProductSpotlight />
      </div>

      <LegacyStats />
      <WhyChooseUs />
      <BranchesCTA />
    </div>
  );
}