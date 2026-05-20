/**
 * Chat Page
 * Main chat interface with rich card rendering, markdown, and structured responses
 */

import React, { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Copy, Check, AlertCircle, ExternalLink, Mail, Github, Linkedin, Globe, Folder } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatSEO } from '~components/SEO';
import { PatternDivider } from '~components/SharedLayout';
import { ChatProvider, ChatContext } from '@/features/chat/context/ChatContext';
import { INITIAL_MESSAGE, SUGGESTED_PROMPTS } from '@/features/chat/constants';
import profile from '@/data/amogh-context.md?raw';

// ─── Types ────────────────────────────────────────────────────────────────────

type CardLink = {
  icon?: 'email' | 'github' | 'linkedin' | 'globe' | 'folder';
  label: string;
  url: string;
  description?: string;
};

type CardSection = {
  title?: string;
  body?: string;
  bullets?: string[];
  links?: CardLink[];
  tip?: string;
};

type StructuredResponse = {
  type: 'card';
  heading: string;
  intro?: string;
  sections: CardSection[];
  tip?: string;
};

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  email:    <Mail size={16} />,
  github:   <Github size={16} />,
  linkedin: <Linkedin size={16} />,
  globe:    <Globe size={16} />,
  folder:   <Folder size={16} />,
};

// ─── Card Renderer ────────────────────────────────────────────────────────────

function CardMessage({ data }: { data: StructuredResponse }) {
  return (
    <div className="bg-zinc-900 text-white rounded-xl overflow-hidden w-full max-w-sm shadow-lg">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-lg font-bold font-mono tracking-tight">{data.heading}</h2>
        {data.intro && (
          <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{data.intro}</p>
        )}
      </div>

      {/* Sections */}
      <div className="px-4 pb-3 space-y-2">
        {data.sections.map((section, i) => (
          <div key={i}>
            {/* Link cards */}
            {section.links && section.links.map((link, j) => (
              <a
                key={j}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all group mb-2 last:mb-0"
              >
                <span className="mt-0.5 text-zinc-400 group-hover:text-white transition-colors">
                  {link.icon ? ICON_MAP[link.icon] : <ExternalLink size={16} />}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white">{link.label}</div>
                  <div className="text-blue-400 text-xs truncate">{link.url.replace(/^https?:\/\//, '')}</div>
                  {link.description && (
                    <div className="text-zinc-400 text-xs mt-0.5">{link.description}</div>
                  )}
                </div>
                <ExternalLink size={12} className="ml-auto mt-1 text-zinc-600 group-hover:text-zinc-300 flex-shrink-0 transition-colors" />
              </a>
            ))}

            {/* Section title + body */}
            {section.title && (
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 mt-2">
                {section.title}
              </p>
            )}
            {section.body && (
              <p className="text-sm text-zinc-300 leading-relaxed">{section.body}</p>
            )}

            {/* Bullet points */}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="space-y-1 mt-1">
                {section.bullets.map((bullet, k) => (
                  <li key={k} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="mt-2 w-1 h-1 rounded-full bg-zinc-500 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Inline tip per section */}
            {section.tip && (
              <div className="mt-2 p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200">
                <span className="font-semibold text-amber-400">Tip: </span>{section.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global tip */}
      {data.tip && (
        <div className="mx-4 mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200">
          <span className="font-semibold text-amber-400">Tip: </span>{data.tip}
        </div>
      )}
    </div>
  );
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────

function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-zinc-600">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 space-y-1 pl-4 list-decimal">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 items-start">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
            <span className="leading-relaxed">{children}</span>
          </li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="mb-2 p-3 bg-zinc-200 rounded text-xs font-mono overflow-x-auto">
            {children}
          </pre>
        ),
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-zinc-900 mb-1 mt-3 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold text-zinc-900 mb-1 mt-3 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-zinc-800 mb-1 mt-2 first:mt-0">{children}</h3>
        ),
        hr: () => <hr className="my-2 border-zinc-300" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-zinc-400 pl-3 italic text-zinc-600 my-2">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─── Smart Message Renderer ───────────────────────────────────────────────────

function MessageRenderer({ content }: { content: string }) {
  let isStructuredCard = false;
  let parsedData: StructuredResponse | null = null;

  try {
    const trimmed = content.trim();
    const jsonStr = trimmed.startsWith('```')
      ? trimmed.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      : trimmed;

    if (jsonStr.startsWith('{') && jsonStr.includes('"type"')) {
      const parsed = JSON.parse(jsonStr) as StructuredResponse;
      if (parsed.type === 'card') {
        isStructuredCard = true;
        parsedData = parsed;
      }
    }
  } catch {
    // Fall through to markdown
  }

  if (isStructuredCard && parsedData) {
    return <CardMessage data={parsedData} />;
  }

  return <MarkdownMessage content={content} />;
}

// ─── Main Chat UI ─────────────────────────────────────────────────────────────

function ChatContent() {
  const context = React.useContext(ChatContext);
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [context?.messages]);

  if (!context) return null;

  const { messages, isLoading, error, sendMessage, clearChat, abortRequest } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    await sendMessage(inputValue);
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="font-mono text-sm text-black whitespace-pre-wrap leading-relaxed">
              {INITIAL_MESSAGE}
            </div>
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
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 ${
                  msg.role === 'user'
                    ? 'flex-row-reverse max-w-xs lg:max-w-md'
                    : 'flex-row max-w-xs lg:max-w-sm xl:max-w-md'
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

                {/* Bubble */}
                <div
                  className={`rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'px-4 py-2.5 bg-zinc-900 text-zinc-100 font-mono'
                      : msg.error
                      ? 'px-4 py-2.5 bg-red-50 text-red-900 border border-red-200'
                      : 'px-4 py-2.5 bg-zinc-100 text-zinc-900'
                  }`}
                >
                  {msg.error && (
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={14} />
                      <span className="text-xs font-semibold">Error</span>
                    </div>
                  )}

                  {!msg.content && msg.role === 'assistant' && isLoading ? (
                    <div className="flex gap-1 py-1">
                      <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  ) : msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="break-words">
                      <MessageRenderer content={msg.content} />
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.content && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="mt-2 text-xs opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <><Check size={12} /> Copied</>
                      ) : (
                        <><Copy size={12} /> Copy</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-mono flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input */}
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
            >
              Stop
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-zinc-700 font-mono text-xs font-semibold transition-colors flex items-center gap-1"
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
