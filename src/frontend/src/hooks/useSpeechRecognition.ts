import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const DEFAULT_LANG = "pt-BR";

interface UseSpeechRecognitionOptions {
  value: string;
  onChange: (next: string) => void;
  lang?: string;
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function joinWithBase(baseText: string, transcript: string): string {
  const trimmedTranscript = transcript.trim();
  if (!trimmedTranscript) return baseText;

  if (!baseText.trim()) return trimmedTranscript;

  const separator = baseText.endsWith(" ") ? "" : " ";
  return `${baseText}${separator}${trimmedTranscript}`;
}

export function useSpeechRecognition({
  value,
  onChange,
  lang = DEFAULT_LANG,
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => getSpeechRecognitionConstructor() !== null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const baseTextRef = useRef("");
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      toast.info("Reconhecimento de voz não é suportado neste navegador. Use o Chrome.");
      return;
    }

    baseTextRef.current = value;
    isListeningRef.current = true;
    setIsListening(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const spokenText = `${finalTranscript}${interimTranscript}`;
      onChangeRef.current(joinWithBase(baseTextRef.current, spokenText));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        toast.error("Permissão de microfone negada. Habilite nas configurações do navegador.");
        stopListening();
        return;
      }

      if (event.error === "no-speech") {
        return;
      }

      if (event.error === "aborted") {
        return;
      }

      toast.error("Não foi possível capturar a voz. Tente novamente.");
      stopListening();
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          stopListening();
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      toast.error("Não foi possível iniciar o microfone. Tente novamente.");
      stopListening();
    }
  }, [lang, stopListening, value]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
      return;
    }

    startListening();
  }, [startListening, stopListening]);

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  return {
    isListening,
    isSupported,
    toggleListening,
    stopListening,
  };
}
