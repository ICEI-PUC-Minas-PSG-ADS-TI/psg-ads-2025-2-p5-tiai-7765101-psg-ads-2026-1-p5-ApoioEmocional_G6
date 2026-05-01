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