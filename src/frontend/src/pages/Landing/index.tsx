import AboutHero from "@/components/about/AboutHero";
import FeaturesSection from "@/components/about/FeaturesSection";
import MissionSection from "@/components/about/MissionSection";
import OdsSection from "@/components/about/OdsSection";
import TeamSection from "@/components/about/TeamSection";
import DisclaimerBanner from "@/components/about/DisclaimerBanner";
import "./Landing.css";

const Landing = () => {
  return (
    <main className="landing-page">
      <AboutHero />
      <div className="landing-features">
        <FeaturesSection />
      </div>
      <MissionSection />
      <OdsSection />
      <TeamSection />
      <DisclaimerBanner />
    </main>
  );
};

export default Landing;
