import "./Home.css";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MoodSelector from "@/components/MoodSelector";
import JournalCard from "@/components/JournalCard";
import InsightsCard from "@/components/InsightsCard";
import CalmNowCard from "@/components/CalmNowCard";
import { Phone } from "lucide-react";

const Home = () => {
  return (
    <div className="page-full">
      <Navbar />

      <main className="container main-content">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-page"
        >
          Good to see you 👋
        </motion.h1>

        <div className="grid-2">
          <MoodSelector />
          <JournalCard />
        </div>

        <InsightsCard />

        <div className="grid-2">
          <CalmNowCard />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card card-stack"
          >
            <h3 className="heading-card">Need help?</h3>
            <p className="text-body">
              If you are going through a difficult moment, you can seek help.
            </p>
            <div className="support-info">
              <p className="support-name">
                CVV – Centro de Valorização da Vida
              </p>
              <p className="support-phone">
                <Phone size={14} /> 188
              </p>
              <span className="text-small">Available 24/7 in Brazil</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Home;
