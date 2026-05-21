/** Respostas coletadas pelo wizard de onboarding (UI). */
export interface OnboardingResponses {
  objective?: string;
  mood?: string;
  frequency?: string;
  helpWith?: string[];
  difficultTimes?: string;
}

/**
 * Espelha os enums do backend (serialização JSON numérica padrão do ASP.NET Core).
 * @see backend.Enum.EmotionsEnum
 */
export enum EmotionsEnum {
  Otimo = 1,
  Bom = 2,
  Okay = 3,
  Triste = 4,
  Estressado = 5,
}

/** @see backend.Enum.UsageFrequencyEnum */
export enum UsageFrequencyEnum {
  Daily = 0,
  FewTimesWeek = 1,
  WhenNeeded = 2,
}

/** @see backend.Enum.PreferenceEnum */
export enum PreferenceEnum {
  Insights = 0,
  Journaling = 1,
  Breathing = 2,
  EmotionalPatterns = 3,
}

/** Corpo enviado em POST /api/UserOnboarding e PUT /api/UserOnboarding/{userId} */
export interface UserOnboardingRequestDto {
  userId: string;
  goal: string;
  initialStatus: EmotionsEnum;
  usage: UsageFrequencyEnum;
  preferences: PreferenceEnum[];
  currentStatus: string;
  completed: boolean;
}

/** Resposta de GET /api/UserOnboarding/{userId} */
export interface UserOnboardingResponseDto {
  id: string;
  userId: string;
  goal: string;
  initialStatus: EmotionsEnum;
  usage: UsageFrequencyEnum;
  preferences: PreferenceEnum[];
  currentStatus: string;
  completed: boolean;
}
