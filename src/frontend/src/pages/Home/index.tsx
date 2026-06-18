import "./Home.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MoodSelector from "@/components/MoodSelector";
import InsightsCard from "@/components/InsightsCard";
import ShortInsightsCard from "@/components/ShortInsightsCard";
import CalmNowCard from "@/components/CalmNowCard";
import NeedHelp from "@/components/NeedHelp";
import { getToken } from "@/services/auth";

const Home = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [insightsRefreshTrigger, setInsightsRefreshTrigger] = useState(0);

  useEffect(() => {
    const userToken = getToken();
    if (userToken) {
      const { nome } = JSON.parse(localStorage.getItem("userToken") || "{}");
      setNome(nome)
    }
  }, []);

  return (
    <main className="home-container main-content">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="home-heading-page"
      >
        Boas vindas, {nome} 👋
      </motion.h1>

      <section className="home-emotional-flow" aria-label="Registro emocional">
        <MoodSelector
          selectedMood={selectedMood}
          onSelectMood={setSelectedMood}
          onSaved={() => setInsightsRefreshTrigger((previous) => previous + 1)}
        />
      </section>

      <section className="home-insights-section" aria-label="Insights emocionais">
        <div className="home-insights-divider">
          <span className="home-insights-divider-line" aria-hidden="true" />
          <span className="home-insights-divider-label">Seu panorama emocional</span>
          <span className="home-insights-divider-line" aria-hidden="true" />
        </div>
        <InsightsCard refreshTrigger={insightsRefreshTrigger} />
        <ShortInsightsCard refreshTrigger={insightsRefreshTrigger} />
      </section>

      <div className="home-grid-2">
        <CalmNowCard />
        <NeedHelp />
      </div>
    </main>
  );
};

export default Home;
