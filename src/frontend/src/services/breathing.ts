import { api } from "./api";

// Definição do tipo para a sessão de respiração
export interface BreathingSessionRequest {
  startTime: string; // ISO String
  endTime: string;   // ISO String
}

export const saveBreathingSession = async (data: BreathingSessionRequest): Promise<void> => {
  const userToken = localStorage.getItem("userToken");
  
  if (!userToken) {
    throw new Error("Token não encontrado");
  }

  const { token } = JSON.parse(userToken);

  await api.post("/Breathing", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};