import "./MoodSelector.css";
<<<<<<< HEAD
import { useState } from "react";
=======
>>>>>>> origin/main
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Ótimo" },
  { emoji: "🙂", label: "Bom" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Triste" },
  { emoji: "😣", label: "Estressado" },
];

const moodMapping: { [key: string]: string } = {
  "Ótimo": "Otimo",
  "Bom": "Bom",
  "Okay": "Okay",
  "Triste": "Triste",
  "Estressado": "Estressado",
};

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
}

const MoodSelector = ({ selectedMood, onSelectMood }: MoodSelectorProps) => {
  const handleMoodClick = (label: string) => {
    onSelectMood(moodMapping[label]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mood-selector-card"
    >
      <h3 className="mood-selector-heading">
        Como você está se sentindo hoje?
      </h3>
      <div className="mood-buttons">
        {moods.map((mood) => {
          const backendMood = moodMapping[mood.label];
          return (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(mood.label)}
              className={`mood-btn${selectedMood === backendMood ? " selected" : ""}`}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
