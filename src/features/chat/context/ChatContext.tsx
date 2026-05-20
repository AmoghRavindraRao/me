/**
 * ChatContext & ChatProvider
 * Manages global chat state and message handling
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { chatClient } from '../api/chatApi';
import type { ChatMessage, ChatContextValue } from '../types';
import { ERROR_MESSAGES } from '../constants';

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  contextData?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, contextData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateId = useCallback(() => `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      setError(ERROR_MESSAGES.INVALID_MESSAGE);
      return;
    }

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);
    setIsLoading(true);

    try {
      let assistantContent = '';
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // Add assistant message to state immediately
      setMessages(prev => [...prev, assistantMessage]);

      // Try streaming first
      try {
        for await (const _chunk of chatClient.streamChat(
          content,
          messages,
          contextData,
          (chunk) => {
            assistantContent += chunk;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: assistantContent,
              };
              return updated;
            });
          }
        )) {
          // Chunks are handled in onChunk callback
        }
      } catch (streamError) {
        // Fallback to non-streaming
        if (streamError instanceof Error && streamError.message !== ERROR_MESSAGES.ABORT_ERROR) {
          console.warn('Streaming failed, attempting non-streaming:', streamError);
          assistantContent = await chatClient.chat(content, messages, contextData);
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: assistantContent,
            };
            return updated;
          });
        } else {
          throw streamError;
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      
      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `I encountered an issue: ${errorMessage}`,
        timestamp: new Date(),
        error: errorMessage,
      };
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, contextData, generateId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    chatClient.abort();
  }, []);

  const abortRequest = useCallback(() => {
    chatClient.abort();
    setIsLoading(false);
  }, []);

  const value: ChatContextValue = {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    abortRequest,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
