import { TimelineEntry } from "../timeline/types";

export const mockEntries: TimelineEntry[] = [
  {
    id: "1",
    date: "2026-03-28",
    dayLabel: "Sábado, 28 de Março",
    emoji: "😊",
    mood: "Feliz",
    intensity: 4,
    preview: "Tive um dia muito produtivo e consegui finalizar...",
    fullText:
      "Tive um dia muito produtivo e consegui finalizar várias tarefas que estavam pendentes. Me senti realizado e com energia positiva ao longo do dia. Conversei com amigos e isso me fez muito bem.",
  },
  {
    id: "2",
    date: "2026-03-27",
    dayLabel: "Sexta, 27 de Março",
    emoji: "😌",
    mood: "Calmo",
    intensity: 3,
    preview: "Dia tranquilo, sem grandes acontecimentos...",
    fullText:
      "Dia tranquilo, sem grandes acontecimentos. Aproveitei para descansar e ler um pouco. Senti uma paz interior que não sentia há dias. Preciso ter mais dias assim.",
  },
  {
    id: "3",
    date: "2026-03-26",
    dayLabel: "Quinta, 26 de Março",
    emoji: "😰",
    mood: "Ansioso",
    intensity: 5,
    preview: "Acordei com muita ansiedade por causa da apresentação...",
    fullText:
      "Acordei com muita ansiedade por causa da apresentação no trabalho. Senti o coração acelerado e dificuldade para me concentrar. Depois que passou, me senti aliviado, mas o cansaço emocional permaneceu.",
  },
  {
    id: "4",
    date: "2026-03-25",
    dayLabel: "Quarta, 25 de Março",
    emoji: "😢",
    mood: "Triste",
    intensity: 4,
    preview: "Senti saudade de pessoas que não vejo há tempos...",
    fullText:
      "Senti saudade de pessoas que não vejo há tempos. O dia estava cinza e chuvoso, o que contribuiu para esse sentimento. Tentei me distrair, mas a melancolia ficou presente até a noite.",
  },
  {
    id: "5",
    date: "2026-03-24",
    dayLabel: "Terça, 24 de Março",
    emoji: "😊",
    mood: "Feliz",
    intensity: 5,
    preview: "Recebi uma notícia muito boa no trabalho...",
    fullText:
      "Recebi uma notícia muito boa no trabalho e passei o dia celebrando internamente. Me senti valorizado e motivado. É bom quando o esforço é reconhecido.",
  },
  {
    id: "6",
    date: "2026-03-23",
    dayLabel: "Segunda, 23 de Março",
    emoji: "😐",
    mood: "Neutro",
    intensity: 2,
    preview: "Um dia comum, sem muitas emoções fortes...",
    fullText:
      "Um dia comum, sem muitas emoções fortes. Fui ao trabalho, voltei, jantei e assisti algo. Não me senti mal, mas também não houve nada marcante.",
  },
  {
    id: "7",
    date: "2026-03-22",
    dayLabel: "Domingo, 22 de Março",
    emoji: "😡",
    mood: "Irritado",
    intensity: 4,
    preview: "Tive uma discussão que me deixou abalado...",
    fullText:
      "Tive uma discussão que me deixou abalado por horas. Senti raiva, mas depois percebi que parte do que me irritou era reflexo do cansaço acumulado. Preciso aprender a lidar melhor com conflitos.",
  },
  {
    id: "8",
    date: "2026-03-21",
    dayLabel: "Sábado, 21 de Março",
    emoji: "😌",
    mood: "Calmo",
    intensity: 3,
    preview: "Passei o dia em casa descansando e refletindo...",
    fullText:
      "Passei o dia em casa descansando e refletindo sobre a semana. Meditei pela manhã e senti uma leveza que me acompanhou ao longo do dia.",
  },
];

export const moodCategories = [
  { label: "Todos", value: "all" },
  { label: "😊 Positivos", value: "positive" },
  { label: "😐 Neutros", value: "neutral" },
  { label: "😢 Negativos", value: "negative" },
];

export const periodFilters = [
  { label: "Semana", value: "week" },
  { label: "Mês", value: "month" },
  { label: "Todos", value: "all" },
];

export const moodCategoryMap: Record<string, string> = {
  Feliz: "positive",
  Calmo: "positive",
  Neutro: "neutral",
  Triste: "negative",
  Ansioso: "negative",
  Irritado: "negative",
};
