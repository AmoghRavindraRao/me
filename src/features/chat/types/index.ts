/**
 * Chat feature types
 * Defines interfaces for messages, chat state, and API responses
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: string;
}

export interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  abortRequest: () => void;
}

export interface StreamingChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  contextData?: string;
}

export interface StreamingChatResponse {
  id: string;
  role: 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatAPIResponse {
  response: string;
  error?: string;
}
