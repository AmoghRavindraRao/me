/**
 * Chat Page
 * Main chat interface with message display, input, and suggested prompts
 */

import React, { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Copy, Check, AlertCircle } from 'lucide-react';
import { ChatSEO } from '~components/SEO';
import { PatternDivider } from '~components/SharedLayout';
import { ChatProvider, ChatContext } from '@/features/chat/context/ChatContext';
import { INITIAL_MESSAGE, SUGGESTED_PROMPTS } from '@/features/chat/constants';
import profile from '@/data/amogh-context.md?raw';

function ChatContent() {
  const context = React.useContext(ChatContext);
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [context?.messages]);

  if (!context) return null;

  const { messages, isLoading, error, sendMessage, clearChat, abortRequest } = context;

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    await sendMessage(inputValue);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <ChatSEO />

      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-4 pt-2 sm:pt-3 md:pt-4 pb-4 sm:pb-6 md:pb-8 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight">
            AI Chat Assistant
          </h1>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 transition-colors whitespace-nowrap"
              aria-label="Clear chat history"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>
        <p className="text-black font-mono text-xs sm:text-sm leading-relaxed border-dashed border-l border-zinc-300 pl-3 sm:pl-4 py-2 sm:py-3 max-w-2xl">
          Chat with an AI version of me. Ask about my projects, skills, experience, or anything else you'd like to know.
        </p>
      </div>

      <PatternDivider />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="font-mono text-sm text-black whitespace-pre-wrap leading-relaxed">
              {INITIAL_MESSAGE}
            </div>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {SUGGESTED_PROMPTS.map((prompt: string) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-left text-xs px-3 py-2 rounded border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 transition-colors font-mono text-black"
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-2 max-w-xs lg:max-w-md xl:max-w-lg ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 text-zinc-100'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {msg.role === 'user' ? 'YOU' : 'AI'}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`px-4 py-2.5 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 text-zinc-100 font-mono'
                        : msg.error
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    {msg.error && (
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={14} />
                        <span className="text-xs font-semibold">Error</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {msg.content || (msg.role === 'assistant' && isLoading ? (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      ) : msg.content)}
                    </div>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={12} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-mono flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            id="chat-input"
            name="message"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything... (Shift+Enter for new line)"
            disabled={isLoading}
            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded text-sm font-mono text-black placeholder:text-zinc-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent min-h-[40px] max-h-[120px]"
            rows={1}
          />
        </div>
        <div className="flex gap-1">
          {isLoading && (
            <button
              onClick={abortRequest}
              className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 font-mono text-xs font-semibold transition-colors"
              title="Stop generation"
            >
              Stop
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-zinc-700 font-mono text-xs font-semibold transition-colors flex items-center gap-1"
            title="Send message (Enter)"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <ChatProvider contextData={profile}>
      <ChatContent />
    </ChatProvider>
  );
}
