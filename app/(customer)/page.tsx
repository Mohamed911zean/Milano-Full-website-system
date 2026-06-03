import  { HeroSlider}  from "@/components/sections/HeroSlider";
import { CollectionIntro } from "@/components/sections/CollectionIntro";
import { SpecialCakeCTA } from "@/components/sections/SpecialCakeCTA";
import { ProductSpotlight } from "@/components/sections/ProductSpotlight";
import { LegacyStats } from "@/components/sections/LegacyStats";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BranchesCTA } from "@/components/sections/BranchesCTA";


export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <HeroSlider />
      <CollectionIntro />
      <SpecialCakeCTA />
      <ProductSpotlight />
      <LegacyStats />
      <WhyChooseUs />
      <BranchesCTA />
    </div>
  );
}

