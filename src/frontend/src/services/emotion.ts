import { api } from "./api";
import type { EmotionRequest } from "@/types/emotion";

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