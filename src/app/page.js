import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import WorkingInstructionsSection from "./components/WorkingInstructionsSection/WorkingInstructionsSection";
import PremiumPropertySection from "./components/PremiumPropertySection/PremiumPropertySection";
import GlobalScaleSection from "./components/GlobalScaleSection/GlobalScaleSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WorkingInstructionsSection />
        <PremiumPropertySection />
        <GlobalScaleSection />
      </main>
    </>
  );
}
