import "./JournalCard.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { addEmotion } from "@/services/emotion";

interface JournalCardProps {
  selectedMood: string | null;
}

const JournalCard = ({ selectedMood }: JournalCardProps) => {
  const [text, setText] = useState("");

  const handleSave = async () => {
    if (!text.trim() || !selectedMood) return;

    try {
      await addEmotion({
        mood: selectedMood,
        diary: text,
      });
      toast.success("Reflexão salva!");
      setText("");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar reflexão");
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
