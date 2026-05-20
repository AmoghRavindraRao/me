/**
 * Chat API client
 * Handles all communication with the chatbot backend
 */

import type { StreamingChatRequest, ChatAPIResponse } from '../types';
import { CHAT_CONFIG, ERROR_MESSAGES } from '../constants';

const CHAT_API_URL = import.meta.env.VITE_CHATBOT_API_URL ?? 'http://localhost:8787';

class ChatClient {
  private abortController: AbortController | null = null;

  /**
   * Stream chat response with backpressure handling
   * Yields chunks as they arrive for real-time display
   */
  async *streamChat(
    message: string,
    conversationHistory: any[],
    contextData?: string,
    onChunk?: (chunk: string) => void
  ): AsyncGenerator<string, void, unknown> {
    if (!message.trim()) {
      throw new Error(ERROR_MESSAGES.INVALID_MESSAGE);
    }

    if (message.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      throw new Error(`Message exceeds maximum length of ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters.`);
    }

    this.abortController = new AbortController();

    const timeoutId = setTimeout(() => {
      this.abortController?.abort();
    }, CHAT_CONFIG.REQUEST_TIMEOUT);

    try {
      const payload: StreamingChatRequest = {
        message,
        conversationHistory: conversationHistory.slice(-CHAT_CONFIG.MAX_HISTORY_LENGTH),
        contextData,
      };

      const response = await fetch(`${CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ChatAPIResponse;
        throw new Error(errorData.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk = JSON.parse(line.slice(6)).content;
              onChunk?.(chunk);
              yield chunk;
            } catch {
              // Skip malformed lines
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.startsWith('data: ')) {
        try {
          const chunk = JSON.parse(buffer.slice(6)).content;
          onChunk?.(chunk);
          yield chunk;
        } catch {
          // Ignore
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(ERROR_MESSAGES.ABORT_ERROR);
        }
        throw error;
      }
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Non-streaming chat request (fallback)
   */
  async chat(
    message: string,
    conversationHistory: any[],
    contextData?: string
  ): Promise<string> {
    if (!message.trim()) {
      throw new Error(ERROR_MESSAGES.INVALID_MESSAGE);
    }

    this.abortController = new AbortController();

    const timeoutId = setTimeout(() => {
      this.abortController?.abort();
    }, CHAT_CONFIG.REQUEST_TIMEOUT);

    try {
      const payload: StreamingChatRequest = {
        message,
        conversationHistory: conversationHistory.slice(-CHAT_CONFIG.MAX_HISTORY_LENGTH),
        contextData,
      };

      const response = await fetch(`${CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ChatAPIResponse;
        throw new Error(errorData.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      const data = (await response.json()) as ChatAPIResponse;
      return data.response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(ERROR_MESSAGES.ABORT_ERROR);
        }
        throw error;
      }
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Abort any in-flight requests
   */
  abort(): void {
    this.abortController?.abort();
  }
}

export const chatClient = new ChatClient();
