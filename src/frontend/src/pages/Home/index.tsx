import "./Home.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
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

  useEffect(() => {
    const userToken = getToken();
    if (userToken) {
      const { nome } = JSON.parse(localStorage.getItem("userToken") || "{}");
      setNome(nome)
    }
  })

  return (
    <div className="page-full">
      <Navbar />

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

        <InsightsCard />

        <div className="home-grid-2">
          <CalmNowCard />

          <NeedHelp />

        </div>
      </main>
    </div>
  );
};

export default Home;
