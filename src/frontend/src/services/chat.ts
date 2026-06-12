import { api } from "./api";
import type { ChatHistoryMessage, ChatHistoryResponse, ChatResponse, Message } from "@/types/chat";
import { getToken } from "./auth";

const DEFAULT_PROVIDER = "gemini";

const fallbackResponse =
  "Nao consegui falar com a API agora, mas continuo aqui com voce. Tente novamente em alguns instantes ou escreva de outro jeito o que esta sentindo.";

export const sendChatMessage = async (
  message: string,
  history: ChatHistoryMessage[]
): Promise<string> => {
  const token = getToken();

  if (!token) {
    throw new Error("Token não encontrado");
  }

  try {
    const response = await api.post<ChatResponse>("/chat", {
      provider: DEFAULT_PROVIDER,
      message,
      history,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.response?.trim() || fallbackResponse;
  } catch {
    return fallbackResponse;
  }
};

export const getTodayMessages = async (): Promise<ChatHistoryResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error("Token não encontrado");
  }

  const response = await api.get<ChatHistoryResponse>("/chat/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
