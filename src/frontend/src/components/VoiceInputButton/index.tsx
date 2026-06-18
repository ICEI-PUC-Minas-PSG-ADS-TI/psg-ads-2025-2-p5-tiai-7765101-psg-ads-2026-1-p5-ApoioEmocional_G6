import { forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import "./VoiceInputButton.css";

export interface VoiceInputButtonHandle {
  stopListening: () => void;
}

interface VoiceInputButtonProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  variant?: "compact" | "default";
  lang?: string;
}

const VoiceInputButton = forwardRef<VoiceInputButtonHandle, VoiceInputButtonProps>(({
  value,
  onChange,
  disabled = false,
  variant = "default",
  lang,
}, ref) => {
  const { isListening, isSupported, toggleListening, stopListening } = useSpeechRecognition({
    value,
    onChange,
    lang,
  });

  useImperativeHandle(ref, () => ({ stopListening }), [stopListening]);

  const isDisabled = disabled || !isSupported;
  const iconSize = variant === "compact" ? 18 : 20;

  return (
    <motion.button
      type="button"
      whileHover={isDisabled ? undefined : { scale: 1.08 }}
      whileTap={isDisabled ? undefined : { scale: 0.92 }}
      className={`voice-input-btn voice-input-btn--${variant}${isListening ? " voice-input-btn--listening" : ""}`}
      onClick={toggleListening}
      disabled={isDisabled}
      aria-label={isListening ? "Parar gravação de voz" : "Iniciar gravação de voz"}
      aria-pressed={isListening}
      title={
        !isSupported
          ? "Reconhecimento de voz disponível no Chrome"
          : isListening
            ? "Parar gravação"
            : "Falar para digitar"
      }
    >
      {isListening ? <MicOff size={iconSize} /> : <Mic size={iconSize} />}
    </motion.button>
  );
});

VoiceInputButton.displayName = "VoiceInputButton";

export default VoiceInputButton;
