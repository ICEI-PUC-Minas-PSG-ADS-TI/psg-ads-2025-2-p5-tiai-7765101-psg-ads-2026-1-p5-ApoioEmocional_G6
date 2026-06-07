export interface BreathingConfig {
  name: string;
  description: string;
  typeId: number;
  sequence: { phase: string; duration: number; action: "inflar" | "esvaziar" | "manter" }[];
}

export const BREATHING_TECHNIQUES: Record<string, BreathingConfig> = {
  quadrada: {
    name: "Respiração Quadrada",
    description: "Utilizada para foco, clareza mental e gerenciamento de estresse elevado.",
    typeId: 1,
    sequence: [
      { phase: "Inspire", duration: 4, action: "inflar" },
      { phase: "Segure", duration: 4, action: "manter" },
      { phase: "Expire", duration: 4, action: "esvaziar" },
      { phase: "Segure (Vazio)", duration: 4, action: "manter" },
    ]
  },
  insonia: {
    name: "Técnica 4-7-8",
    description: "Atua como um calmante natural para o sistema nervoso, ideal para insônia e relaxamento.",
    typeId: 2,
    sequence: [
      { phase: "Inspire", duration: 4, action: "inflar" },
      { phase: "Segure", duration: 7, action: "manter" },
      { phase: "Expire", duration: 8, action: "esvaziar" },
    ]
  },
  ansiedade: {
    name: "Ancoragem Rápida",
    description: "Ritmo curto para momentos de agitação extrema, ajudando a desacelerar a mente.",
    typeId: 3,
    sequence: [
      { phase: "Inspire", duration: 3, action: "inflar" },
      { phase: "Expire", duration: 3, action: "esvaziar" },
    ]
  },
  suspiro: {
    name: "Suspiro Autonômico",
    description: "A forma mais rápida validada pela neurociência para interromper o estresse agudo na hora.",
    typeId: 4,
    sequence: [
      { phase: "Inspire Fundo", duration: 2, action: "inflar" },
      { phase: "Inspire +", duration: 1, action: "inflar" },
      { phase: "Solte o ar lentamente", duration: 4, action: "esvaziar" },
    ]
  },
  coerencia: {
    name: "Respiração Coerente",
    description: "Sincroniza o ritmo cardíaco com o respiratório. Excelente para controle de ansiedade crônica.",
    typeId: 5,
    sequence: [
      { phase: "Inspire devagar", duration: 5, action: "inflar" },
      { phase: "Expire devagar", duration: 5, action: "esvaziar" },
    ]
  }
};