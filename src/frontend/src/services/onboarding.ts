import { api } from "./api";
import { getToken } from "./auth";
import type {
  UserOnboardingRequestDto,
  UserOnboardingResponseDto,
} from "@/types/onboarding";
import type { AxiosError } from "axios";

function authHeaders() {
  const token = getToken();
  if (!token) {
    throw new Error("Sessão expirada ou token não encontrado.");
  }
  return { Authorization: `Bearer ${token}` } as const;
}

/**
 * GET /api/UserOnboarding/{userId}
 * @returns `null` se ainda não existir registro (404).
 */
export async function getUserOnboarding(
  userId: string
): Promise<UserOnboardingResponseDto | null> {
  try {
    const { data } = await api.get<UserOnboardingResponseDto>(
      `/UserOnboarding/${userId}`,
      { headers: authHeaders() }
    );
    return data;
  } catch (err) {
    const status = (err as AxiosError).response?.status;
    if (status === 404) return null;
    throw err;
  }
}

/** POST /api/UserOnboarding */
export async function createUserOnboarding(
  body: UserOnboardingRequestDto
): Promise<UserOnboardingResponseDto> {
  const { data } = await api.post<UserOnboardingResponseDto>(
    "/UserOnboarding",
    body,
    { headers: authHeaders() }
  );
  return data;
}

/** PUT /api/UserOnboarding/{userId} */
export async function updateUserOnboarding(
  userId: string,
  body: UserOnboardingRequestDto
): Promise<UserOnboardingResponseDto> {
  const { data } = await api.put<UserOnboardingResponseDto>(
    `/UserOnboarding/${userId}`,
    body,
    { headers: authHeaders() }
  );
  return data;
}
