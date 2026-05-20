/**
 * useChat hook
 * Custom hook to use the ChatContext
 */

import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import type { ChatContextValue } from '../types';

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
