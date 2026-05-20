/**
 * Chatbot API Worker - Cloudflare Worker
 * Handles chat requests using OpenRouter LLM API
 * 
 * Deploy: wrangler publish -c wrangler-chatbot.toml
 */

const githubApi = 'https://api.github.com/users/AmoghRavindraRao';
const linkedin = 'https://www.linkedin.com/in/amogh-r-rao03';
const email = 'amoghravindrarao@gmail.com';

// Load profile.json at build/startup time (embed it, or fetch it if served locally)
let profileData = null;

// Load profile data with error handling
async function loadProfileData() {
  if (profileData) return profileData;
  try {
    // Try importing directly if bundled
    profileData = await import('../profile.json', { assert: { type: 'json' } }).then(m => m.default);
  } catch (err) {
    console.warn('Failed to load profile.json:', err);
    profileData = {};
  }
  return profileData;
}

// Cache system prompt to avoid rebuilding on every request
let cachedSystemPrompt = null;
let promptBuildTime = 0;
const PROMPT_CACHE_DURATION = 3600000; // 1 hour

async function buildSystemPrompt() {
  // Return cached prompt if fresh
  if (cachedSystemPrompt && Date.now() - promptBuildTime < PROMPT_CACHE_DURATION) {
    return cachedSystemPrompt;
  }

  try {
    // Load profile data
    const profile = await loadProfileData();

    // Fetch live GitHub data at runtime with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    let githubUser = { public_repos: 'N/A', followers: 'N/A', bio: 'N/A' };
    let githubRepos = [];

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`${githubApi}`, { signal: controller.signal }),
        fetch(`${githubApi}/repos?sort=updated&per_page=10`, { signal: controller.signal })
      ]);
      
      if (userRes.ok) githubUser = await userRes.json();
      if (reposRes.ok) githubRepos = await reposRes.json();
    } finally {
      clearTimeout(timeoutId);
    }

    const repoSummary = githubRepos
      .map(r => `- **${r.name}**: ${r.description || 'No description'} ([GitHub](https://github.com/AmoghRavindraRao/${r.name})) — ${r.stargazers_count} ⭐`)
      .join('\n');

    const systemPrompt = `You are AI Amogh — a professional AI assistant representing Amogh Ravindra Rao.
Your job is to answer questions about Amogh in a confident, polished, and concise manner, as if you ARE Amogh's personal representative.
particularly questions related to Amogh Ravindra Rao's career, background, skills and experience.
Your responsibility is to represent Amogh Ravindra Rao for interactions on the website as faithfully as possible.
You are given a summary of Amogh Ravindra Rao's background and LinkedIn profile which you can use to answer questions.
Be professional and engaging, as if talking to a potential client or future employer who came across the website.

---
## PROFILE DATA (from profile.json)
${JSON.stringify(profile, null, 2)}

---
## GITHUB (live data from github.com/AmoghRavindraRao)
- Public repos: ${githubUser.public_repos}
- Followers: ${githubUser.followers}
- Bio: ${githubUser.bio || 'N/A'}

### Recent Repositories:
${repoSummary}

---
## LINKEDIN
LinkedIn Profile: [${linkedin}](${linkedin})
(LinkedIn data is not fetchable at runtime — rely on profile.json for career/education details)

---
## RESPONSE FORMATTING GUIDELINES

### Structure & Presentation
- Format all responses using **Markdown** for proper structure and readability
- Use proper **paragraphing** to separate different ideas; use blank lines between logical sections
- Organize multi-part answers with **bullet points** (use \`-\` or \`*\`) for clarity
- Use **bold** (\`**text**\`) for important terms and section headers
- For longer responses, use **headings** (\`## Heading\`) to organize sections

### Links & References
- **Always include hyperlinks** when referencing projects, websites, profiles, or repositories
- When mentioning GitHub projects, include a link: \`[project-name](https://github.com/AmoghRavindraRao/project-name)\`
- When discussing LinkedIn, use: \`[LinkedIn](${linkedin})\`
- For external websites or resources, provide clickable links with descriptive text
- Format: \`[descriptive text](url)\` — never leave bare URLs

### Content Guidelines
- Be professional, warm, and specific — never vague or generic
- Do not use hyphens or placeholders in your answers; be direct and clear
- Always ground answers in the data above; don't fabricate
- For technical questions, reference real projects and skills from the data
- Keep answers concise (2–4 sentences) for quick questions; provide detailed breakdowns only when specifically requested
- For business or collaboration inquiries, direct users to: [LinkedIn](${linkedin})
- If asked something outside your knowledge, say: "That's not something I have details on — feel free to reach out to Amogh directly on [LinkedIn](${linkedin})."`;

    cachedSystemPrompt = systemPrompt;
    promptBuildTime = Date.now();
    return systemPrompt;
  } catch (err) {
    console.error('Failed to build system prompt:', err);
    // Return minimal fallback prompt with safe defaults
    return `You are AI Amogh — a professional AI assistant representing Amogh Ravindra Rao.
Answer questions about Amogh in a confident, polished, and specific manner.

---
## PROFILE DATA
${JSON.stringify(profileData || {}, null, 2)}

## GITHUB
- Visit: https://github.com/AmoghRavindraRao

## LINKEDIN
Profile: ${linkedin || 'https://www.linkedin.com/in/amogh-r-rao03'}

---
## CONTACT INFORMATION
**Email**: ${email || 'amoghravindrarao@gmail.com'}
**LinkedIn**: ${linkedin || 'https://www.linkedin.com/in/amogh-r-rao03'}
**GitHub**: https://github.com/AmoghRavindraRao

---
## RESPONSE RULES
- Be professional and engaging
- Only use provided data — never fabricate
- For business inquiries: direct to LinkedIn or email
- Keep responses concise and focused
Output ONLY valid JSON — no prose before or after. Schema:
 
{
  "type": "card",
  "heading": "Short title",
  "intro": "One sentence intro (optional)",
  "sections": [
    {
      "title": "Section label (optional)",
      "body": "Paragraph text (optional)",
      "bullets": ["bullet 1", "bullet 2"],
      "links": [
        {
          "icon": "email|github|linkedin|globe|folder",
          "label": "Display name",
          "url": "https://...",
          "description": "Short subtitle (optional)"
        }
      ],
      "tip": "Optional tip text"
    }
  ],
  "tip": "Global tip shown at bottom (optional)"
}
 
CARD examples — use card mode when asked:
- "How do I contact you?" → card with email, LinkedIn, GitHub links
- "Show me your projects" → card with folder links per project
- "What are your skills?" → card with bullets grouped by category
- "Tell me about yourself" → card with intro + sections
 
### MODE 2 — MARKDOWN
Use for: conversational answers, explanations, career questions, opinions, anything narrative.
Write clean markdown: use **bold** for emphasis, bullet lists where helpful, paragraphs for prose.
Never output raw symbols like \`**text**\` as literal characters — format properly.
 
---
## RESPONSE RULES
- Never fabricate — only use data provided above
- No hyphens as placeholders; be direct
- For business/job inquiries: direct to linkedin.com/in/amogh-r-rao03 or amoghravindrarao@gmail.com
- Concise: 2–4 sentences for conversational, full card for structured
- If outside your knowledge: "I don't have details on that — reach out to Amogh on LinkedIn."
`;
  }
}





/**
 * @typedef {Object} ChatRequest
 * @property {string} message
 * @property {Array<{role: string; content: string}>} [conversationHistory]
 * @property {string} [contextData]
 */

/**
 * @typedef {Object} StreamChunk
 * @property {string} content
 */

/**
 * Handle POST /chat endpoint with streaming
 */
async function handleChat(request, env) {
	// Check origin for CORS
	const origin = request.headers.get('Origin') || '';
	
// Only allow specific origins for security
		const allowedOrigins = [
			'https://amogh-portfolio.com',
			'https://amogh-portfolio.pages.dev',
			'https://amoghravindrarao.vercel.app',
			'http://localhost:3000',
			'http://localhost:5173'
		];
		const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://amogh-portfolio.com';
		const corsHeaders = {
			'Access-Control-Allow-Origin': corsOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	};

	// Parse request
	const data = await request.json();
	const { message, conversationHistory = [], contextData = '' } = data;

	if (!message?.trim()) {
		return new Response(JSON.stringify({ error: 'Message is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders,
			},
		});
	}

	// Get OpenRouter API key from environment
	const apiKey = env.OPENROUTER_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'API key not configured' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders,
			},
		});
	}

	// Validate API key format (should start with 'sk-or-' or similar)
	if (apiKey.length < 20 || /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(apiKey)) {
		console.error('Invalid API key detected - contains control characters or wrong format');
		console.error('API key length:', apiKey.length);
		console.error('First chars:', JSON.stringify(apiKey.substring(0, 10)));
		return new Response(JSON.stringify({ 
			error: 'Invalid API key configuration - key appears corrupted or incorrectly set',
			details: 'Please verify OPENROUTER_API_KEY is set correctly in Wrangler secrets'
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders,
			},
		});
	}

	// Build system prompt on-demand
	const systemPrompt = await buildSystemPrompt();

	// Build messages for OpenRouter
	const messages = [
		{
			role: 'system',
			content: systemPrompt + (contextData ? `\n\nProfile Context:\n${contextData}` : ''),
		},
		...conversationHistory.map((msg) => ({
			role: msg.role || 'user',
			content: msg.content,
		})),
		{ role: 'user', content: message },
	];

	try {
		// Log request details for debugging (sanitize API key)
		const sanitizedKey = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5);
		console.log('=== OpenRouter Request ===');
		console.log('Model: mistralai/mistral-7b-instruct:free');
		console.log('Messages count:', messages.length);
		console.log('API Key prefix:', sanitizedKey);
		console.log('Request body keys:', Object.keys({
			model: "mistralai/mistral-7b-instruct:free",
			messages,
			temperature: 0.7,
			max_tokens: 1500,
			stream: true,
		}));

		// Call OpenRouter API
		const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				'HTTP-Referer': 'https://amoghravindrarao.vercel.app',
				'X-Title': 'Amogh Portfolio Chatbot',
			},
			body: JSON.stringify({
				model: "mistralai/mistral-7b-instruct:free",
				messages,
				temperature: 0.7,
				max_tokens: 1500,
				stream: true,
			}),
		});

		console.log('OpenRouter response status:', response.status);
		console.log('OpenRouter response ok:', response.ok);

		if (!response.ok) {
			const errorText = await response.text();
			console.log('=== OpenRouter Error Response ===');
			console.log('Raw response text:', errorText);
			console.log('Response text length:', errorText.length);
			
			let errorDetails = 'Unknown error';
			let errorJson = null;
			
			if (errorText && errorText.length > 0) {
				try {
					errorJson = JSON.parse(errorText);
					console.log('Parsed error JSON:', errorJson);
					errorDetails = errorJson.error?.message || errorJson.message || errorJson.error || JSON.stringify(errorJson);
				} catch (parseErr) {
					// errorText is not JSON, use as-is
					console.error('Failed to parse error response as JSON:', parseErr.message);
					errorDetails = errorText;
				}
			} else {
				console.warn('Empty error response from OpenRouter');
				errorDetails = 'Empty response from OpenRouter';
			}
			
			console.error('=== Final Error Details ===');
			console.error('Status:', response.status);
			console.error('Details:', errorDetails);
			
			throw new Error(`OpenRouter API error: ${response.status} - ${errorDetails}`);
		}
		
		console.log('OpenRouter response OK, starting stream...');

		// Stream the response
		const { readable, writable } = new TransformStream();
		const writer = writable.getWriter();
		const reader = response.body?.getReader();

		if (!reader) {
			await writer.close();
			return new Response(JSON.stringify({ error: 'No response body' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		(async () => {
			const streamTimeout = setTimeout(() => {
				console.error('Stream timeout');
				reader.cancel();
			}, 30000); // 30 second timeout

			try {
				const decoder = new TextDecoder();
				let buffer = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop() || '';

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							const chunk = line.slice(6);
							if (chunk === '[DONE]') continue;

							try {
								const json = JSON.parse(chunk);
								const content = json.choices?.[0]?.delta?.content || '';
								if (content) {
									await writer.write(
										new TextEncoder().encode(
											`data: ${JSON.stringify({ content })}\n`
										)
									);
								}
							// eslint-disable-next-line no-unused-vars
							} catch (e) {
								// Skip parse errors
							}
						}
					}
				}

				// Process remaining buffer
				if (buffer.startsWith('data: ')) {
					const chunk = buffer.slice(6);
					if (chunk !== '[DONE]') {
						try {
							const json = JSON.parse(chunk);
							const content = json.choices?.[0]?.delta?.content || '';
							if (content) {
								await writer.write(
									new TextEncoder().encode(
										`data: ${JSON.stringify({ content })}\n`
									)
								);
							}
						// eslint-disable-next-line no-unused-vars
						} catch (e) {
							// Ignore
						}
					}
				}

				await writer.close();
			} catch (err) {
				console.error('Stream error:', err);
				await writer.close();
			} finally {
				clearTimeout(streamTimeout);
			}
		})();

		return new Response(readable, {
			status: 200,
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
				...corsHeaders,
			},
		});
	} catch (error) {
		console.error('Chat error:', error);
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : 'Internal server error',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			}
		);
	}
}

/**
 * Main request handler
 */
async function handleRequest(request, env) {
	// Handle CORS preflight
	if (request.method === 'OPTIONS') {
		const origin = request.headers.get('Origin') || '';
		const allowedOrigins = [
			'https://amogh-portfolio.com',
			'https://amogh-portfolio.pages.dev',
			'https://amoghravindrarao.vercel.app',
			'http://localhost:3000',
			'http://localhost:5173'
		];
		const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://amogh-portfolio.com';
		const corsHeaders = {
			'Access-Control-Allow-Origin': corsOrigin,
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		return new Response(null, {
			status: 200,
			headers: corsHeaders,
		});
	}

	const { pathname } = new URL(request.url);

	// Health check endpoint
	if (pathname === '/health') {
		return new Response(JSON.stringify({ status: 'ok' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Debug endpoint - check if API key is configured
	if (pathname === '/debug/config' && request.method === 'GET') {
		const apiKey = env.OPENROUTER_API_KEY;
		return new Response(JSON.stringify({
			apiKeyConfigured: !!apiKey,
			apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET',
			environment: env.ENVIRONMENT || 'unknown',
			timestamp: new Date().toISOString(),
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Chat endpoint
	if (pathname === '/chat' && request.method === 'POST') {
		return handleChat(request, env);
	}

	// 404
	return new Response(JSON.stringify({ error: 'Not found' }), {
		status: 404,
		headers: { 'Content-Type': 'application/json' },
	});
}

export default {
	fetch: handleRequest,
};
