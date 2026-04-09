import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7075/api",
});

export const registerEmotion = async (mood: string, diary: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado');
  }

  const response = await api.post(
    "/emotions",
    { mood, diary },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};