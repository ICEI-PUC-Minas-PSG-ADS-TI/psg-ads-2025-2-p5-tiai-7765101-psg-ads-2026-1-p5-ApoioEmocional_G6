import { api } from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/Auth/login", data);
  const { token, nome } = response.data;
  localStorage.setItem("userToken", JSON.stringify({ token, nome }));
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await api.post("/Auth/register", data);
};

export const tokenExpired = async (): Promise<boolean> => {
  const userToken = getToken();
  const {token} = JSON.parse(localStorage.getItem("userToken") || "{}");
  if (!token) {
    logout();
    return true;
  }

  try {
    const response = await api.get("/auth/expired", {
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
  localStorage.removeItem("userToken");
};

export const getToken = (): string | null => {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) return null;
  const { token } = JSON.parse(userToken);
  return token;
};

const NAME_ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

/**
 * Lê o `userId` (GUID) do JWT sem validar assinatura (apenas payload).
 * Compatível com tokens emitidos pelo backend (`ClaimTypes.NameIdentifier`).
 */
export const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as Record<string, string | undefined>;
    const id = payload["sub"] ?? payload[NAME_ID_CLAIM];
    return id ?? null;
  } catch {
    return null;
  }
};