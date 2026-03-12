import { useState } from "react";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😣", label: "Stressed" },
];

const MoodSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <h3 className="heading-card" style={{ marginBottom: "1rem" }}>
        How are you feeling today?
      </h3>
      <div className="mood-buttons">
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(mood.label)}
            className={`mood-btn${selected === mood.label ? " selected" : ""}`}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
