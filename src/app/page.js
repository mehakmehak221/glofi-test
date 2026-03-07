import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import WorkingInstructionsSection from "./components/WorkingInstructionsSection/WorkingInstructionsSection";
import PremiumPropertySection from "./components/PremiumPropertySection/PremiumPropertySection";
import GlobalScaleSection from "./components/GlobalScaleSection/GlobalScaleSection";
import PropertyInvestmentCategoriesSection from "./components/PropertyInvestmentCategoriesSection/PropertyInvestmentCategoriesSection";
import InvestmentSection from "./components/InvestmentSection/InvestmentSection";
import JoinNewGenerationSection from "./components/JoinNewGenerationSection/JoinNewGenerationSection";
import GlofiCopyrightSection from "./components/GlofiCopyrightSection/GlofiCopyrightSection";
import CookieSection from "./components/CookieSection/CookieSection";

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

        <div className="h-[88px]">

        </div>
        <CookieSection />
      </main>
    </>
  );
}
