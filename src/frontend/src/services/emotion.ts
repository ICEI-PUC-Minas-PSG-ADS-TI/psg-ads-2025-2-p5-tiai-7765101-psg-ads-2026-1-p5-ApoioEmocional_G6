import { api } from "./api";
import type {
  EmotionDailyGroupResponse,
  EmotionRequest,
} from "@/types/emotion";

export const addEmotion = async (data: EmotionRequest): Promise<void> => {
  const {token} = JSON.parse(localStorage.getItem("userToken") || "{}");

  if (!token) {
    throw new Error("Token não encontrado");
  }

  await api.post("/Emotions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Função para obter todas as emoções agrupadas por dia

export const getWeeklyEmotions = async (): Promise<EmotionDailyGroupResponse[]> => {
  const { token } = JSON.parse(localStorage.getItem("userToken") || "{}");

  if (!token) throw new Error("Token não encontrado");

  const response = await api.get<EmotionDailyGroupResponse[]>("/Emotions/week", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Busca todas as emoções, sem filtro de semana, para o histórico completo (Timeline)

export const getAllEmotions = async (): Promise<EmotionDailyGroupResponse[]> => {
  const { token } = JSON.parse(localStorage.getItem("userToken") || "{}");

  if (!token) throw new Error("Token não encontrado");

  const response = await api.get<EmotionDailyGroupResponse[]>("/Emotions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};