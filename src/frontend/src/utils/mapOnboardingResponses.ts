import type { OnboardingResponses } from "@/types/onboarding";
import {
  EmotionsEnum,
  PreferenceEnum,
  UsageFrequencyEnum,
  type UserOnboardingRequestDto,
} from "@/types/onboarding";

const MOOD_TO_EMOTION: Record<string, EmotionsEnum> = {
  Bem: EmotionsEnum.Bom,
  Neutro: EmotionsEnum.Okay,
  "Não muito bem": EmotionsEnum.Triste,
  "Ansioso(a)": EmotionsEnum.Estressado,
  Triste: EmotionsEnum.Triste,
};

const FREQUENCY_TO_USAGE: Record<string, UsageFrequencyEnum> = {
  Diariamente: UsageFrequencyEnum.Daily,
  "Algumas vezes por semana": UsageFrequencyEnum.FewTimesWeek,
  Semanalmente: UsageFrequencyEnum.FewTimesWeek,
  "Quando sentir necessidade": UsageFrequencyEnum.WhenNeeded,
};

const HELP_TO_PREFERENCE: Record<string, PreferenceEnum> = {
  "Registrar meu humor": PreferenceEnum.Insights,
  "Meditar e relaxar": PreferenceEnum.Breathing,
  "Escrever um diário": PreferenceEnum.Journaling,
  "Entender meus padrões emocionais": PreferenceEnum.EmotionalPatterns,
  "Ter apoio em momentos difíceis": PreferenceEnum.Insights,
};

const DEFAULT_GOAL = "Não informado";
const DEFAULT_MOOD = EmotionsEnum.Okay;
const DEFAULT_USAGE = UsageFrequencyEnum.WhenNeeded;

/**
 * Converte respostas da UI do Onboarding para o DTO esperado pela API.
 */
export function mapOnboardingResponsesToRequest(
  responses: OnboardingResponses,
  userId: string,
  completed: boolean = true
): UserOnboardingRequestDto {
  const goal = responses.objective?.trim() || DEFAULT_GOAL;

  const initialStatus =
    responses.mood && MOOD_TO_EMOTION[responses.mood] !== undefined
      ? MOOD_TO_EMOTION[responses.mood]
      : DEFAULT_MOOD;

  const usage =
    responses.frequency && FREQUENCY_TO_USAGE[responses.frequency] !== undefined
      ? FREQUENCY_TO_USAGE[responses.frequency]
      : DEFAULT_USAGE;

  const preferences: PreferenceEnum[] = [];
  for (const label of responses.helpWith ?? []) {
    const pref = HELP_TO_PREFERENCE[label];
    if (pref !== undefined && !preferences.includes(pref)) {
      preferences.push(pref);
    }
  }

  const currentStatus = responses.difficultTimes?.trim() ?? "";

  return {
    userId,
    goal,
    initialStatus,
    usage,
    preferences,
    currentStatus,
    completed,
  };
}
