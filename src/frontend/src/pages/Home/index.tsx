import "./Home.css";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MoodSelector from "@/components/MoodSelector";
import JournalCard from "@/components/JournalCard";
import InsightsCard from "@/components/InsightsCard";
import CalmNowCard from "@/components/CalmNowCard";
import { Phone } from "lucide-react";
import NeedHelp from "@/components/NeedHelp";

const Home = () => {
  return (
    <div className="page-full">
      <Navbar />

      <main className="home-container main-content">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="home-heading-page"
        >
          Boas vindas 👋
        </motion.h1>

        <div className="home-grid-2">
          <MoodSelector />
          <JournalCard />
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
