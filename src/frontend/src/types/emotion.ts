export interface EmotionRequest {
    mood: string;
    diary: string;
}

export interface EmotionResponse {
    id: string;
    mood: string;
    userId: string;
    createdAt: string;
    diary: string;
}

export interface EmotionDailyGroupResponse {
    date: string;
    emotions: EmotionResponse[];
}