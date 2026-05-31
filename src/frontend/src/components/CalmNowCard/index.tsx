import "./CalmNowCard.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import BreathingExercise from "@/components/BreathingExercise";
import { BREATHING_TECHNIQUES } from "@/constants/breathing";

const CalmNowCard = () => {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("quadrada");

  const currentTechnique = BREATHING_TECHNIQUES[selectedKey];

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

      {/* Select para escolha da técnica */}
      <div className="technique-select-container">
        <label htmlFor="technique-select" className="technique-label">Escolha um objetivo:</label>
        <select
          id="technique-select"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="technique-select"
        >
          <option value="quadrada">Foco e Clareza (Quadrada)</option>
          <option value="insonia">Dormir Melhor (4-7-8)</option>
          <option value="ansiedade">Crise de Ansiedade (Ancoragem)</option>
          <option value="suspiro">Alívio de Estresse Rápido (Suspiro)</option>
          <option value="coerencia">Equilíbrio Geral (Coerente)</option>
        </select>
      </div>

      <p className="calm-now-description">
        {currentTechnique.description}
      </p>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button onClick={() => setOpen(true)} className="calm-now-btn calm-now-btn-primary">
          Iniciar {currentTechnique.name}
        </button>
      </motion.div>

      {/* Passando a técnica ativa por propriedade para o modal */}
      <BreathingExercise 
        open={open} 
        onClose={() => setOpen(false)} 
        technique={currentTechnique}
      />
    </motion.div>
  );
};

export default CalmNowCard;