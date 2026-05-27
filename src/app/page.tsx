import Navbar from "@/components/sections/Navbar/Navbar";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import AssetPartnersSection from "@/components/sections/AssetPartnersSection/AssetPartnersSection";
import WorkingInstructionsSection from "@/components/sections/WorkingInstructionsSection/WorkingInstructionsSection";
import PremiumPropertySection from "@/components/sections/PremiumPropertySection/PremiumPropertySection";
import GlobalScaleSection from "@/components/sections/GlobalScaleSection/GlobalScaleSection";
import PropertyInvestmentCategoriesSection from "@/components/sections/PropertyInvestmentCategoriesSection/PropertyInvestmentCategoriesSection";
import InvestmentSection from "@/components/sections/InvestmentSection/InvestmentSection";
import JoinNewGenerationSection from "@/components/sections/JoinNewGenerationSection/JoinNewGenerationSection";
import GlofiCopyrightSection from "@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection";
import AppDownloadSection from "@/components/sections/AppDownloadSection/AppDownloadSection";
import CookieSection from "@/components/sections/CookieSection/CookieSection";
import ValuesSection from "@/components/sections/ValueSection/ValueSection";
import HowItWorksSection from "@/components/HowItWorksSection/HowItWorksSection";

export default function Home() {
  return (
    <div className="landing-page w-full bg-white">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <AssetPartnersSection />
        <WorkingInstructionsSection />
        <ValuesSection />
        <HowItWorksSection />
        <InvestmentSection />
        <GlobalScaleSection />
        <PremiumPropertySection />

        {/* <PropertyInvestmentCategoriesSection /> */}

        <JoinNewGenerationSection />
        {/* <AppDownloadSection /> */}
        <GlofiCopyrightSection />


        {/* <CookieSection /> */}

      </main>
    </div>
  );
}

