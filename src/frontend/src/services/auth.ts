import { api } from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/Auth/login", data);
  const { token } = response.data;
  localStorage.setItem("token", token);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await api.post("/Auth/register", data);
};

