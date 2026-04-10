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

export const tokenExpired = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) {
    logout();
    return true;
  }

  try {
    const response = await api.get("/api/auth/expired", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // O backend retorna { success: true, expired: boolean }
    if (response.data?.expired === true) {
      logout();
      return true;
    }

    return false;
  } catch (err: any) {
    // 400 = token mal formado (back-end responde BadRequest)
    if (err?.response?.status === 400) {
      logout();
      return true;
    }

    throw err;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
};