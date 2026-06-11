export interface Message {
  id: string | number;
  role: "user" | "ai";
  text: string;
}

export interface ChatResponse {
  response: string;
}

export interface ChatHistoryMessage {
  role: string;
  content: string;
}

export interface ChatHistoryMessageDto {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessageDto[];
}
