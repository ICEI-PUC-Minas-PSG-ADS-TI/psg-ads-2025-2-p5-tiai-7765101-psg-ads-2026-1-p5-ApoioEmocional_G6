import { motion } from "framer-motion";
import MissionSection from "@/components/about/MissionSection";
import OdsSection from "@/components/about/OdsSection";
import TeamSection from "@/components/about/TeamSection";
import DisclaimerBanner from "@/components/about/DisclaimerBanner";
import "./About.css";

interface AboutProps {
  variant?: "public" | "authenticated";
}

const About = ({ variant = "public" }: AboutProps) => {
  if (variant === "authenticated") {
    return (
      <main className="about-page-authenticated">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="about-page-authenticated-header"
        >
          <h1>Sobre nós</h1>
          <p>
            Conheça a missão, a equipe e os valores por trás do EMOTi IA — uma
            plataforma de apoio emocional com inteligência artificial.
          </p>
        </motion.div>
        <MissionSection />
        <OdsSection />
        <TeamSection />
        <DisclaimerBanner />
      </main>
    );
  }

  return (
    <main className="about-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="about-page-hero"
      >
        <h1>Sobre nós</h1>
        <p>
          Conheça a missão, a equipe e os valores por trás do EMOTi IA — uma
          plataforma de apoio emocional com inteligência artificial.
        </p>
      </motion.div>
      <MissionSection />
      <OdsSection />
      <TeamSection />
      <DisclaimerBanner />
    </main>
  );
};

export default About;
