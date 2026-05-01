import "./CalmNowCard.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind } from "lucide-react";
import { saveBreathingSession } from "@/services/breathing"; 

const CalmNowCard = () => {
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState("Inspire");
  const [startTime, setStartTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;
    if (breathing) {
      setPhase("Inspire");
      interval = window.setInterval(() => {
        setPhase((prev) => (prev === "Inspire" ? "Expire" : "Inspire"));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [breathing]);

  const handleStartBreathing = () => {
    setStartTime(new Date().toISOString()); // Captura o início do exercício de respiração
    setBreathing(true);
  };

  const handleStopBreathing = async () => {
    const endTime = new Date().toISOString(); // Captura o fim do exercício de respiração
    setBreathing(false);

    if (startTime) {
      try {
        await saveBreathingSession({
          startTime: startTime,
          endTime: endTime,
        });
        console.log("Exercício salvo com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar sessão de respiração:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="calm-now-card calm-now-card-stack"
    >
      <h3 className="calm-now-heading calm-title">
        <Wind size={20} />
        Precisa de um momento para respirar?
      </h3>

      <AnimatePresence mode="wait">
        {breathing ? (
          <motion.div key="breathing" className="breathing-area">
            <div className="breathing-circles">
              <motion.div
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="breathing-outer"
              />
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="breathing-inner"
              />
              <motion.p key={phase} className="breathing-text">
                {phase}
              </motion.p>
            </div>
            
            <button onClick={handleStopBreathing} className="calm-now-btn calm-now-btn-outline">
              Parar
            </button>
          </motion.div>
        ) : (
          <motion.div key="start">
            <button onClick={handleStartBreathing} className="calm-now-btn calm-now-btn-primary">
              Iniciar Exercício de Respiração
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalmNowCard;