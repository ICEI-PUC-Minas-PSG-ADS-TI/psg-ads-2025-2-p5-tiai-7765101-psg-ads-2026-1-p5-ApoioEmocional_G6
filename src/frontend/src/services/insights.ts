import axios from "axios";
import { api } from "./api";
import { getToken } from "./auth";
import type { InsightsResponse } from "@/types/insights";

export const getInsights = async (): Promise<InsightsResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await api.get<InsightsResponse>("/insights", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const detail =
        error.response?.data?.detail ??
        error.response?.data?.title ??
        error.message;
      throw new Error(`Erro ao obter insights: ${detail}`);
    }
    throw error;
  }
};
