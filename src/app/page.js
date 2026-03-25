import Navbar from "@/components/sections/Navbar/Navbar";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import WorkingInstructionsSection from "@/components/sections/WorkingInstructionsSection/WorkingInstructionsSection";
import PremiumPropertySection from "@/components/sections/PremiumPropertySection/PremiumPropertySection";
import GlobalScaleSection from "@/components/sections/GlobalScaleSection/GlobalScaleSection";
import PropertyInvestmentCategoriesSection from "@/components/sections/PropertyInvestmentCategoriesSection/PropertyInvestmentCategoriesSection";
import InvestmentSection from "@/components/sections/InvestmentSection/InvestmentSection";
import JoinNewGenerationSection from "@/components/sections/JoinNewGenerationSection/JoinNewGenerationSection";
import GlofiCopyrightSection from "@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection";
import CookieSection from "@/components/sections/CookieSection/CookieSection";

export default function Home() {
  return (
    <div className="max-w-[1440px] mx-auto w-full overflow-x-hidden border-x border-white/5 bg-[var(--color-bg-dark)] shadow-2xl">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <WorkingInstructionsSection />
        <PremiumPropertySection />
        <GlobalScaleSection />
        <PropertyInvestmentCategoriesSection />
        <InvestmentSection />
        <JoinNewGenerationSection />
        <GlofiCopyrightSection />

        <div className="h-[88px]">

        </div>
        <CookieSection />
        <div className="h-[28px]" />
      </main>
    </div>
  );
}
