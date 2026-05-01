import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import type { OnboardingResponses } from "@/types/onboarding";
import "./Onboarding.css";

export type { OnboardingResponses };

interface OnboardingProps {
  onComplete: (responses: OnboardingResponses) => Promise<void>;
}

const TOTAL_STEPS = 6;

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<OnboardingResponses>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const next = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onComplete(responses);
    } catch (e: unknown) {
      let message: string | undefined;
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        if (typeof data === "string") message = data;
        else if (data && typeof data === "object" && "message" in data) {
          const m = (data as { message?: unknown }).message;
          if (typeof m === "string") message = m;
        }
      } else if (e instanceof Error) {
        message = e.message;
      }
      setSubmitError(message ?? "Não foi possível salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const select = (key: keyof OnboardingResponses, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  const toggleHelpWith = (value: string) => {
    setResponses((prev) => {
      const current = prev.helpWith || [];
      return {
        ...prev,
        helpWith: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="onboarding-step onboarding-welcome">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="onboarding-icon-wrapper"
            >
              <Heart size={40} />
            </motion.div>
            <h1 className="onboarding-title">Bem-vindo ao Emot AI</h1>
            <p className="onboarding-text">
              Estamos felizes em ter você aqui. Este é um espaço seguro para
              cuidar da sua saúde emocional, no seu ritmo.
            </p>
            <p className="onboarding-text-secondary">
              Vamos fazer algumas perguntas rápidas para personalizar sua
              experiência. Você pode pular qualquer uma delas.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="onboarding-step">
            <h2 className="onboarding-question">O que te trouxe até aqui?</h2>
            <p className="onboarding-hint">Escolha o que mais faz sentido para você</p>
            <div className="onboarding-options">
              {[
                "Autoconhecimento",
                "Gerenciar ansiedade",
                "Acompanhar meu humor",
                "Buscar equilíbrio emocional",
              ].map((opt) => (
                <button
                  key={opt}
                  className={`onboarding-option${responses.objective === opt ? " selected" : ""}`}
                  onClick={() => select("objective", opt)}
                >
                  {responses.objective === opt && <Check size={16} />}
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <h2 className="onboarding-question">
              Como você tem se sentido nos últimos dias?
            </h2>
            <p className="onboarding-hint">Sem julgamentos — apenas como você está</p>
            <div className="onboarding-options onboarding-mood-options">
              {[
                { emoji: "😊", label: "Bem" },
                { emoji: "😐", label: "Neutro" },
                { emoji: "😔", label: "Não muito bem" },
                { emoji: "😰", label: "Ansioso(a)" },
                { emoji: "😢", label: "Triste" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  className={`onboarding-option onboarding-mood-btn${responses.mood === opt.label ? " selected" : ""}`}
                  onClick={() => select("mood", opt.label)}
                >
                  <span className="onboarding-emoji">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step">
            <h2 className="onboarding-question">
              Com que frequência você gostaria de registrar como está se sentindo?
            </h2>
            <div className="onboarding-options">
              {["Diariamente", "Algumas vezes por semana", "Semanalmente", "Quando sentir necessidade"].map(
                (opt) => (
                  <button
                    key={opt}
                    className={`onboarding-option${responses.frequency === opt ? " selected" : ""}`}
                    onClick={() => select("frequency", opt)}
                  >
                    {responses.frequency === opt && <Check size={16} />}
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-step">
            <h2 className="onboarding-question">
              O que você gostaria que o app te ajudasse a fazer?
            </h2>
            <p className="onboarding-hint">Você pode escolher mais de uma opção</p>
            <div className="onboarding-options">
              {[
                "Registrar meu humor",
                "Meditar e relaxar",
                "Escrever um diário",
                "Entender meus padrões emocionais",
                "Ter apoio em momentos difíceis",
              ].map((opt) => (
                <button
                  key={opt}
                  className={`onboarding-option${(responses.helpWith || []).includes(opt) ? " selected" : ""}`}
                  onClick={() => toggleHelpWith(opt)}
                >
                  {(responses.helpWith || []).includes(opt) && <Check size={16} />}
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="onboarding-step">
            <h2 className="onboarding-question">
              Você tem enfrentado momentos difíceis recentemente?
            </h2>
            <p className="onboarding-hint">
              Esta pergunta é opcional — fique à vontade para pular
            </p>
            {submitError && (
              <p className="onboarding-submit-error" role="alert">
                {submitError}
              </p>
            )}
            <div className="onboarding-options">
              {["Sim, bastante", "Um pouco", "Estou bem no momento", "Prefiro não responder"].map(
                (opt) => (
                  <button
                    key={opt}
                    className={`onboarding-option${responses.difficultTimes === opt ? " selected" : ""}`}
                    onClick={() => select("difficultTimes", opt)}
                  >
                    {responses.difficultTimes === opt && <Check size={16} />}
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="onboarding-overlay">
      {/* Progress bar */}
      <div className="onboarding-progress-bar">
        <motion.div
          className="onboarding-progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <p className="onboarding-step-indicator">
        Passo {step + 1} de {TOTAL_STEPS}
      </p>

      <div className="onboarding-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="onboarding-nav">
          {step > 0 ? (
            <button
              type="button"
              className="onboarding-btn-back"
              onClick={back}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : (
            <div />
          )}

          <div className="onboarding-nav-right">
            {step > 0 && !isLastStep && (
              <button
                type="button"
                className="onboarding-btn-skip"
                onClick={() => void next()}
                disabled={isSubmitting}
              >
                Pular
              </button>
            )}
            <button
              type="button"
              className="onboarding-btn-next"
              onClick={() => void next()}
              disabled={isSubmitting}
            >
              {isLastStep ? (
                <>
                  {isSubmitting ? "Salvando..." : "Começar"}{" "}
                  {!isSubmitting && <Sparkles size={16} />}
                </>
              ) : (
                <>
                  Continuar <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
