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
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WorkingInstructionsSection />
        <PremiumPropertySection />
        <GlobalScaleSection />
        <PropertyInvestmentCategoriesSection />
        <InvestmentSection />
        <JoinNewGenerationSection />
        <GlofiCopyrightSection />
        <CookieSection />
      </main>
    </>
  );
}
