import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatsBar from "./components/StatsBar";
import HowItWorks from "./components/HowItWorks";
import MilestoneTypes from "./components/MilestoneTypes";
import UseCases from "./components/UseCases";
import CTABanner from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <MilestoneTypes />
        <UseCases />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
