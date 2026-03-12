import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const JournalCard = () => {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (!text.trim()) return;
    toast.success("Reflection saved!");
    setText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card card-stack"
    >
      <h3 className="heading-card">Journal</h3>
      <textarea
        placeholder="Write how your day is going..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-textarea"
      />
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button onClick={handleSave} className="btn btn-primary">
          Save Reflection
        </button>
      </motion.div>
    </motion.div>
  );
};

export default JournalCard;
