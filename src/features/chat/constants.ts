/**
 * Chat feature constants
 * Suggested prompts, initial messages, and configuration
 */

export const INITIAL_MESSAGE = `Hey! I'm AI Amogh. I'm trained on Amogh's portfolio data, projects, and background. Ask me anything about:

• ML/AI projects & methodologies
• Work experience & skills
• Education & certifications
• Tools & tech stack
• Data science & analytics
• Career goals & interests

Type a question or choose one below!`;

export const SUGGESTED_PROMPTS = [
  "What are your main ML projects?",
  "Tell me about your LLM Council project",
  "What skills do you have?",
  "What's your work experience?",
  "What are you looking for in a role?",
  "How can I reach out to you?",
];

export const SYSTEM_PROMPT = `You are AI Amogh, a friendly and knowledgeable assistant trained on Amogh Ravindra Rao's professional profile, projects, and background.

You have access to:
- Professional experience and skills
- ML/AI projects and technical details
- Educational background from ASU and RNIT
- Certifications and achievements

Guidelines:
- Be conversational and helpful
- Provide specific examples from projects when relevant
- If asked something not in your knowledge base, be honest about it
- Keep responses concise but informative
- Use emojis sparingly to keep the conversation professional
- Direct users to LinkedIn or email for serious inquiries`;

export const ERROR_MESSAGES = {
  CONNECTION_ERROR: 'Failed to connect to the chat service. Please try again.',
  INVALID_MESSAGE: 'Message cannot be empty.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  ABORT_ERROR: 'Request was cancelled.',
};

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2500,
  STREAM_CHUNK_SIZE: 50,
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_HISTORY_LENGTH: 20, // Keep last 20 messages for context
};
