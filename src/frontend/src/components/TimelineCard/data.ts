export const moodCategories = [
  { label: "Todos", value: "all" },
  { label: "😊 Positivos", value: "positive" },
  { label: "😢 Negativos", value: "negative" },
];

export const periodFilters = [
  { label: "Semana", value: "week" },
  { label: "Mês", value: "month" },
  { label: "Todos", value: "all" },
];

export const moodCategoryMap: Record<string, string> = {
  "Otimo": "positive",
  "Bom": "positive",
  "Okay": "negative",
  "Triste": "negative",
  "Estressado": "negative",
};

export const moodEmojiMap: Record<string, string> = {
  "Otimo": "😊",
  "Bom": "🙂",
  "Okay": "😐",
  "Triste": "😔",
  "Estressado": "😣",
};
