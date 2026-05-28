import "./MoodSelector.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { addEmotion } from "@/services/emotion";
import { toast } from "react-toastify";

const moods = [
  { emoji: "😊", label: "Ótimo" },
  { emoji: "🙂", label: "Bom" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Triste" },
  { emoji: "😣", label: "Estressado" },
];

const moodMapping: Record<string, string> = {
  Ótimo: "Otimo",
  Bom: "Bom",
  Okay: "Okay",
  Triste: "Triste",
  Estressado: "Estressado",
};

const moodDisplayLabels: Record<string, string> = {
  Otimo: "Ótimo",
  Bom: "Bom",
  Okay: "Okay",
  Triste: "Triste",
  Estressado: "Estressado",
};

const supportiveMessages: Record<string, string> = {
  Otimo: "Que bom saber disso! Quer registrar o que está tornando seu dia especial?",
  Bom: "Fico feliz em ouvir você. O que tem contribuído para esse momento?",
  Okay: "Está tudo bem sentir o que sentir. Quer desabafar um pouco, no seu ritmo?",
  Triste: "Sinto muito que esteja assim. Estou aqui para ouvir — escreva quando quiser.",
  Estressado: "Respire com calma. O que está pesando mais no seu dia hoje?",
};

const CONFETTI_COLORS = ["#4A90E2", "#7B6EF6", "#ffffff"];
const SUCCESS_AUTO_RETURN_MS = 4000;

const stepVariants = {
  enter: { opacity: 0, x: 48 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -48 },
};

type FlowStep = "mood" | "reflection" | "success";

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelectMood: (mood: string | null) => void;
  onSaved?: () => void;
}

const MoodSelector = ({ selectedMood, onSelectMood, onSaved }: MoodSelectorProps) => {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("mood");
  const [savedMoodEmoji, setSavedMoodEmoji] = useState<string | null>(null);
  const confettiTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedMoodEmoji = moods.find((m) => moodMapping[m.label] === selectedMood)?.emoji;

  const resetToMood = useCallback(() => {
    setText("");
    setSavedMoodEmoji(null);
    onSelectMood(null);
    setFlowStep("mood");
  }, [onSelectMood]);

  const fireConfetti = useCallback(() => {
    const baseOptions = {
      spread: 70,
      origin: { y: 0.55 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    };

    confetti({ ...baseOptions, particleCount: 80 });

    const secondBurst = setTimeout(() => {
      confetti({
        ...baseOptions,
        particleCount: 40,
        angle: 60,
        origin: { x: 0, y: 0.55 },
      });
      confetti({
        ...baseOptions,
        particleCount: 40,
        angle: 120,
        origin: { x: 1, y: 0.55 },
      });
    }, 300);

    confettiTimeoutsRef.current.push(secondBurst);
  }, []);

  useEffect(() => {
    if (flowStep !== "success") return;

    fireConfetti();

    const returnTimer = setTimeout(resetToMood, SUCCESS_AUTO_RETURN_MS);

    return () => {
      clearTimeout(returnTimer);
      confettiTimeoutsRef.current.forEach(clearTimeout);
      confettiTimeoutsRef.current = [];
    };
  }, [flowStep, fireConfetti, resetToMood]);

  const handleMoodClick = (label: string) => {
    onSelectMood(moodMapping[label]);
    setFlowStep("reflection");
  };

  const handleBack = () => {
    setText("");
    onSelectMood(null);
    setFlowStep("mood");
  };

  const handleSave = async () => {
    if (!text.trim() || !selectedMood || isSaving) return;

    setIsSaving(true);
    try {
      await addEmotion({ mood: selectedMood, diary: text });
      setText("");
      setSavedMoodEmoji(selectedMoodEmoji ?? null);
      onSaved?.();
      setFlowStep("success");
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message ?? "Não foi possível salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const cardModifier =
    flowStep === "reflection"
      ? " emotional-check-in--reflection"
      : flowStep === "success"
        ? " emotional-check-in--success"
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`emotional-check-in${cardModifier}`}
    >
      <div className="emotional-check-in-glow" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {flowStep === "mood" && (
          <motion.div
            key="mood-step"
            className="emotional-check-in-step"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <header className="emotional-check-in-header">
              <span className="emotional-check-in-eyebrow">Seu momento de hoje</span>
              <h3 className="emotional-check-in-heading">
                Como você está se sentindo agora?
              </h3>
              <p className="emotional-check-in-hint">
                Toque em uma emoção para começar sua reflexão
              </p>
            </header>

            <div className="mood-buttons" role="group" aria-label="Selecione sua emoção">
              {moods.map((mood) => (
                <motion.button
                  key={mood.label}
                  type="button"
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleMoodClick(mood.label)}
                  className="mood-btn"
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {flowStep === "reflection" && selectedMood && (
          <motion.div
            key="reflection-step"
            className="emotional-check-in-step emotional-check-in-step--reflection"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <button
              type="button"
              className="reflection-back-btn"
              onClick={handleBack}
              disabled={isSaving}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar
            </button>

            <header className="emotional-check-in-header emotional-check-in-header--reflection">
              <div className="reflection-selected-badge">
                <span className="reflection-selected-emoji">{selectedMoodEmoji}</span>
                <span>Você está se sentindo {moodDisplayLabels[selectedMood]}</span>
              </div>
              <p className="reflection-message">{supportiveMessages[selectedMood]}</p>
            </header>

            <textarea
              placeholder="Conte como foi seu dia, sem pressa. Cada palavra importa..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="reflection-textarea"
              rows={6}
              autoFocus
            />

            <div className="reflection-actions">
              <motion.button
                type="button"
                whileHover={{ scale: text.trim() ? 1.02 : 1 }}
                whileTap={{ scale: text.trim() ? 0.98 : 1 }}
                onClick={handleSave}
                disabled={!text.trim() || isSaving}
                className="reflection-save-btn"
              >
                {isSaving ? (
                  <>
                    <span className="reflection-save-spinner" aria-hidden="true" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="reflection-save-icon" aria-hidden="true">✦</span>
                    Guardar este momento
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {flowStep === "success" && (
          <motion.div
            key="success-step"
            className="emotional-check-in-step emotional-check-in-step--success"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            role="status"
            aria-live="polite"
          >
            {savedMoodEmoji && (
              <span className="success-step-emoji" aria-hidden="true">
                {savedMoodEmoji}
              </span>
            )}
            <span className="success-step-icon" aria-hidden="true">✓</span>
            <h3 className="success-step-title">Momento guardado com carinho</h3>
            <p className="success-step-subtitle">
              Obrigado por compartilhar. Volte quando quiser registrar de novo.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MoodSelector;
