import "./CalmNowCard.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import BreathingExercise from "@/components/BreathingExercise";

const CalmNowCard = () => {
  const [open, setOpen] = useState(false);

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

      <p className="calm-now-description">
        Uma sessão guiada de respiração para acalmar sua mente em apenas alguns minutos.
      </p>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button onClick={() => setOpen(true)} className="calm-now-btn calm-now-btn-primary">
          Iniciar Exercício de Respiração
        </button>
      </motion.div>

      <BreathingExercise open={open} onClose={() => setOpen(false)} />
    </motion.div>
  );
};

export default CalmNowCard;