import "./BreathingExercise.css";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wind, Heart, Sparkles } from "lucide-react";
import { saveBreathingSession } from "@/services/breathing";

interface BreathingExerciseProps {
  open: boolean;
  onClose: () => void;
}

type Stage = "intro" | "exercise" | "complete";
type Phase = "inhale" | "hold" | "exhale";

const PHASE_DURATIONS: Record<Phase, number> = {
  inhale: 4,
  hold: 4,
  exhale: 6,
};

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Inspire",
  hold: "Segure",
  exhale: "Expire devagar",
};

const TOTAL_CYCLES = 4;

const TUTORIAL_TIPS = [
  {
    title: "Postura confortável",
    desc: "Sente-se ereto com as costas suavemente apoiadas.",
    icon: (
      <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="18" r="6" />
        <path d="M22 48c0-8 4-14 10-14s10 6 10 14" />
        <path d="M16 54h32" />
      </svg>
    ),
  },
  {
    title: "Relaxe os ombros",
    desc: "Deixe os ombros descerem, leves e soltos.",
    icon: (
      <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="20" r="6" />
        <path d="M18 36c4-4 9-4 14-4s10 0 14 4" />
        <path d="M16 40c2 2 5 3 8 3M48 40c-2 2-5 3-8 3" />
      </svg>
    ),
  },
  {
    title: "Respire pelo nariz",
    desc: "Inspire suavemente pelo nariz.",
    icon: (
      <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 12c-6 8-6 18 0 28" />
        <path d="M28 38c1 2 3 3 4 3s3-1 4-3" />
        <path d="M22 22c2-2 4-2 6 0M42 22c-2-2-4-2-6 0" />
      </svg>
    ),
  },
  {
    title: "Expiração lenta e suave",
    desc: "Solte o ar lentamente pela boca.",
    icon: (
      <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="22" cy="32" r="8" />
        <path d="M30 28c4-2 8-2 14 0M30 32c5-1 10-1 18 0M30 36c4 2 8 2 14 0" />
      </svg>
    ),
  },
];

const BreathingExercise = ({ open, onClose }: BreathingExerciseProps) => {
  const [stage, setStage] = useState<Stage>("intro");
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setStage("intro");
      setPhase("inhale");
      setCycle(0);
      setElapsed(0);
      setStartTime(null);
      setSessionSaved(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (stage !== "exercise") return;
    const duration = PHASE_DURATIONS[phase] * 1000;
    const timer = window.setTimeout(() => {
      if (phase === "inhale") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else {
        const nextCycle = cycle + 1;
        if (nextCycle >= TOTAL_CYCLES) {
          setStage("complete");
        } else {
          setCycle(nextCycle);
          setPhase("inhale");
        }
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [stage, phase, cycle]);

  useEffect(() => {
    if (stage !== "exercise") return;
    setElapsed(0);
    const start = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 200);
    return () => window.clearInterval(id);
  }, [stage]);

  const totalDuration = useMemo(
    () => TOTAL_CYCLES * (PHASE_DURATIONS.inhale + PHASE_DURATIONS.hold + PHASE_DURATIONS.exhale),
    []
  );
  const progress = Math.min((elapsed / totalDuration) * 100, 100);
  const orbScale = phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 0.9;
  const orbTransition = {
    duration: PHASE_DURATIONS[phase],
    ease: phase === "hold" ? "linear" : "easeInOut",
  } as const;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes}:${remainder.toString().padStart(2, "0")}`;
  };

  const persistSession = async () => {
    if (!startTime || sessionSaved) return;
    try {
      await saveBreathingSession({
        startTime,
        endTime: new Date().toISOString(),
      });
      setSessionSaved(true);
    } catch (error) {
      console.error("Erro ao salvar sessão de respiração:", error);
    }
  };

  const handleStartExercise = () => {
    setStartTime(new Date().toISOString());
    setStage("exercise");
  };

  const handleClose = async () => {
    await persistSession();
    onClose();
  };

  useEffect(() => {
    if (stage === "complete") {
      void persistSession();
    }
  }, [stage]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="breath-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => void handleClose()}
          role="dialog"
          aria-modal="true"
          aria-label="Exercício de respiração"
        >
          <motion.div
            className="breath-modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="breath-close" onClick={() => void handleClose()} aria-label="Fechar">
              <X size={20} />
            </button>
            <div className="breath-particles" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="breath-particle"
                  style={{ left: `${10 + i * 15}%` }}
                  animate={{ y: [-20, -120], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 8 + i, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {stage === "intro" && (
                <motion.div
                  key="intro"
                  className="breath-stage"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="breath-intro-header">
                    <div className="breath-icon-circle">
                      <Wind size={26} />
                    </div>
                    <h2 className="breath-title">Vamos respirar juntos</h2>
                    <p className="breath-subtitle">
                      Um exercício guiado de 4 ciclos para acalmar mente e corpo.
                    </p>
                  </div>

                  <div className="breath-tips-grid">
                    {TUTORIAL_TIPS.map((tip, i) => (
                      <motion.div
                        key={tip.title}
                        className="breath-tip"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                      >
                        <motion.div
                          className="breath-tip-icon"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {tip.icon}
                        </motion.div>
                        <h4>{tip.title}</h4>
                        <p>{tip.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="breath-phase-cards">
                    {(["inhale", "hold", "exhale"] as Phase[]).map((currentPhase) => (
                      <div key={currentPhase} className={`breath-phase-card breath-phase-${currentPhase}`}>
                        <span className="breath-phase-dot" />
                        <strong>{PHASE_LABELS[currentPhase]}</strong>
                        <span className="breath-phase-time">{PHASE_DURATIONS[currentPhase]}s</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className="breath-cta"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartExercise}
                  >
                    Iniciar exercício
                  </motion.button>
                </motion.div>
              )}

              {stage === "exercise" && (
                <motion.div
                  key="exercise"
                  className="breath-stage breath-stage-exercise"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="breath-meta">
                    <span className="breath-cycle">Ciclo {cycle + 1} de {TOTAL_CYCLES}</span>
                    <span className="breath-timer">{formatTime(elapsed)}</span>
                  </div>
                  <div className="breath-orb-wrap">
                    <motion.div
                      className="breath-orb-glow"
                      animate={{ scale: orbScale, opacity: phase === "exhale" ? 0.4 : 0.7 }}
                      transition={orbTransition}
                    />
                    <motion.div
                      className="breath-orb"
                      animate={{ scale: orbScale }}
                      transition={orbTransition}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={phase}
                          className="breath-orb-label"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.5 }}
                        >
                          {PHASE_LABELS[phase]}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <div className="breath-progress">
                    <motion.div
                      className="breath-progress-fill"
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.25 }}
                    />
                  </div>
                  <button className="breath-stop" onClick={() => void handleClose()}>
                    Encerrar sessão
                  </button>
                </motion.div>
              )}

              {stage === "complete" && (
                <motion.div
                  key="complete"
                  className="breath-stage breath-stage-complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="breath-complete-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <Heart size={42} />
                  </motion.div>
                  <h2 className="breath-title">Muito bem</h2>
                  <p className="breath-subtitle">
                    Você tirou um momento para si. Perceba como seu corpo se sente agora.
                  </p>
                  <div className="breath-complete-actions">
                    <motion.button
                      className="breath-cta"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => void handleClose()}
                    >
                      <Sparkles size={16} /> Finalizar
                    </motion.button>
                    <button className="breath-stop" onClick={() => void handleClose()}>
                      Fechar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreathingExercise;
