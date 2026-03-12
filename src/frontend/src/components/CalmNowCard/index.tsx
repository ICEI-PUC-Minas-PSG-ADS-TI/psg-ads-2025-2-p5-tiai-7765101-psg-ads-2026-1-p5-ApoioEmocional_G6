import "./CalmNowCard.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind } from "lucide-react";

const CalmNowCard = () => {
  const [breathing, setBreathing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="calm-now-card calm-now-card-stack"
    >
      <h3 className="calm-now-heading calm-title">
        <Wind size={20} />
        Precisa de um momento para respirar?
      </h3>

      <AnimatePresence mode="wait">
        {breathing ? (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="breathing-area"
          >
            <div className="breathing-circles">
              <motion.div
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="breathing-outer"
              />
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="breathing-inner"
              />
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="breathing-text"
              >
                Breathe
              </motion.p>
            </div>
            <button onClick={() => setBreathing(false)} className="calm-now-btn calm-now-btn-outline">
              Stop
            </button>
          </motion.div>
        ) : (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button onClick={() => setBreathing(true)} className="calm-now-btn calm-now-btn-primary">
                Iniciar Exercício de Respiração
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalmNowCard;
