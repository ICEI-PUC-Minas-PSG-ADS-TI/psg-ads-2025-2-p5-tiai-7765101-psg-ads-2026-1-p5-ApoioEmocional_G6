import "./Home.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MoodSelector from "@/components/MoodSelector";
import JournalCard from "@/components/JournalCard";
import InsightsCard from "@/components/InsightsCard";
import CalmNowCard from "@/components/CalmNowCard";
import { Phone } from "lucide-react";
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

      <div className="home-grid-2">
        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
        <JournalCard selectedMood={selectedMood} />
      </div>

        <div className="home-grid-2">
          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
          <JournalCard
            selectedMood={selectedMood}
            onSaved={() => setInsightsRefreshTrigger((previous) => previous + 1)}
          />
        </div>

        <InsightsCard refreshTrigger={insightsRefreshTrigger} />

        <NeedHelp />

      </div>
    </main>
  );
};

export default Home;
