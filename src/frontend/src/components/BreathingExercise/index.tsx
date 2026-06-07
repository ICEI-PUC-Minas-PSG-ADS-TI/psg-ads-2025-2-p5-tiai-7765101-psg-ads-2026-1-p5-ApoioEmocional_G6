import "./BreathingExercise.css";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wind, Heart, Sparkles } from "lucide-react";
import { saveBreathingSession } from "@/services/breathing";
import { BreathingConfig } from "@/constants/breathing";

interface BreathingExerciseProps {
  open: boolean;
  onClose: () => void;
  technique: BreathingConfig; // Recebe a técnica selecionada do CalmNowCard
}

type Stage = "intro" | "exercise" | "complete";

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

const BreathingExercise = ({ open, onClose, technique }: BreathingExerciseProps) => {
  const [stage, setStage] = useState<Stage>("intro");
  const [stepIndex, setStepIndex] = useState(0); // Controla qual passo da sequência estamos
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  // Mapeia o passo atual da sequência da técnica ativa
  const currentStep = technique.sequence[stepIndex];

  useEffect(() => {
    if (open) {
      setStage("intro");
      setStepIndex(0);
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

  // Loop principal do exercício adaptado para sequências dinâmicas
  useEffect(() => {
    if (stage !== "exercise") return;

    const duration = currentStep.duration * 1000;
    const timer = window.setTimeout(() => {
      const nextStep = stepIndex + 1;

      if (nextStep < technique.sequence.length) {
        setStepIndex(nextStep);
      } else {
        // Se terminou a sequência de passos, avança o ciclo global
        const nextCycle = cycle + 1;
        if (nextCycle >= TOTAL_CYCLES) {
          setStage("complete");
        } else {
          setCycle(nextCycle);
          setStepIndex(0); // Reseta para o primeiro passo da técnica
        }
      }
    }, duration);

    return () => window.clearTimeout(timer);
  }, [stage, stepIndex, cycle, technique]);

  // Timer acumulativo de segundos passados
  useEffect(() => {
    if (stage !== "exercise") return;
    setElapsed(0);
    const start = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 200);
    return () => window.clearInterval(id);
  }, [stage]);

  // Calcula de forma dinâmica o tempo total baseado na soma de tempos da técnica escolhida
  const totalDuration = useMemo(() => {
    const sequenceTotalTime = technique.sequence.reduce((acc, step) => acc + step.duration, 0);
    return TOTAL_CYCLES * sequenceTotalTime;
  }, [technique]);

  const progress = Math.min((elapsed / totalDuration) * 100, 100);

  // Escala dinâmica da esfera com base na propriedade 'action' definida na constante
  const orbScale = currentStep?.action === "inflar" ? 1.5 : currentStep?.action === "esvaziar" ? 0.9 : 1.4;
  
  const orbTransition = {
    duration: currentStep?.duration || 4,
    ease: currentStep?.action === "manter" ? "linear" : "easeInOut",
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
        breathingType: technique.typeId, // Enviando o ID numérico do Enum configurado
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
                    <h2 className="breath-title">{technique.name}</h2>
                    <p className="breath-subtitle">
                      {technique.description} Exercício guiado de {TOTAL_CYCLES} ciclos.
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

                  {/* Renderização dinâmica dos cards contendo os tempos das fases da técnica ativa */}
                  <div className="breath-phase-cards">
                    {technique.sequence.map((step, idx) => (
                      <div key={idx} className="breath-phase-card breath-phase-inhale">
                        <span className="breath-phase-dot" />
                        <strong>{step.phase}</strong>
                        <span className="breath-phase-time">{step.duration}s</span>
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
                      animate={{ scale: orbScale, opacity: currentStep?.action === "esvaziar" ? 0.4 : 0.7 }}
                      transition={orbTransition}
                    />
                    <motion.div
                      className="breath-orb"
                      animate={{ scale: orbScale }}
                      transition={orbTransition}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={stepIndex}
                          className="breath-orb-label"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.5 }}
                        >
                          {currentStep?.phase}
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
                    Você completou o exercício de {technique.name}. Perceba como seu corpo se sente agora.
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