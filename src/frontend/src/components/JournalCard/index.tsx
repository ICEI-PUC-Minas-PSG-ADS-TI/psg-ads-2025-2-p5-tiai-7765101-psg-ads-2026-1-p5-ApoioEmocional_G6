import "./JournalCard.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { addEmotion } from "@/services/emotion";
import { toast } from "react-toastify";

interface JournalCardProps {
  selectedMood: string | null;
  onSaved?: () => void;
}

const JournalCard = ({ selectedMood, onSaved }: JournalCardProps) => {
  const [text, setText] = useState("");

  const handleSave = async () => {
    if (!text.trim() || !selectedMood) return;

    try {
      await toast.promise(addEmotion({ mood: selectedMood, diary: text }), {
        pending: "Salvando reflexão...",
        success: "Reflexão salva!",
      });
      setText("");
      onSaved?.();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="journal-card journal-card-stack"
    >
      <h3 className="journal-heading">Diário</h3>
      <textarea
        placeholder="Escreva como está indo seu dia..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="journal-textarea"
      />
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button onClick={handleSave} className="journal-btn journal-btn-primary">
          Salvar Reflexão
        </button>
      </motion.div>
    </motion.div>
  );
};

export default JournalCard;
