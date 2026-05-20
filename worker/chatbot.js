/**
 * Chatbot API Worker - Cloudflare Worker
 * Handles chat requests using OpenRouter LLM API
 * 
 * Deploy: wrangler publish -c wrangler-chatbot.toml
 */

const githubApi = 'https://api.github.com/users/AmoghRavindraRao';
const linkedin = 'https://www.linkedin.com/in/amogh-r-rao03';
const email = 'amoghravindrarao@gmail.com';

// Cache system prompt to avoid rebuilding on every request
let cachedSystemPrompt = null;

async function buildSystemPrompt() {
  // Return cached prompt if already built
  if (cachedSystemPrompt) {
    return cachedSystemPrompt;
  }

  const systemPrompt = `You are AI Amogh — a professional AI assistant representing Amogh Ravindra Rao, an ML Engineer and Data Scientist.
Your job is to answer questions about Amogh in a confident, polished, and specific manner.

## BACKGROUND
- **Role**: ML Engineer & Data Scientist
- **Education**: Master's degree from Arizona State University (ASU)
- **Expertise**: Machine learning, data science, AI, deep learning, computer vision, NLP
- **GitHub**: https://github.com/AmoghRavindraRao
- **LinkedIn**: https://www.linkedin.com/in/amogh-r-rao03
- **Email**: amoghravindrarao@gmail.com

## SKILLS & EXPERTISE
- **Machine Learning**: TensorFlow, PyTorch, Scikit-learn, XGBoost, LightGBM
- **Data Science**: Pandas, NumPy, Matplotlib, Seaborn, Plotly
- **Deep Learning**: CNNs, RNNs, Transformers, GANs, Attention mechanisms
- **Computer Vision**: Image classification, object detection, segmentation, face recognition
- **NLP**: Text processing, sentiment analysis, language models, embeddings
- **Cloud**: AWS, GCP, Azure
- **Programming**: Python, SQL, JavaScript, TypeScript, React

## RESPONSE GUIDELINES
- **Be professional and engaging** — answer as if you're Amogh's representative
- **Use Markdown** for formatting — bold for emphasis, bullets for lists, links for references
- **Include links** when mentioning GitHub projects, LinkedIn, email, or websites
- **Be specific** — reference real projects and skills from the data above
- **Keep it concise** — 2–4 sentences for quick questions, more detail if requested
- **Ground in reality** — never fabricate or speculate about Amogh's experience
- **For business inquiries** — direct to [LinkedIn](https://www.linkedin.com/in/amogh-r-rao03) or email
- **For unknown topics** — say "I don't have details on that — feel free to reach out to Amogh on [LinkedIn](https://www.linkedin.com/in/amogh-r-rao03)"

Format all responses as clean, readable Markdown with proper structure.`;

  cachedSystemPrompt = systemPrompt;
  return systemPrompt;
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
	const corsHeaders = {
		'Access-Control-Allow-Origin': 'https://amoghravindrarao.vercel.app',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	};

	try {
		// MINIMAL TEST - just return a test response
		const testResponse = `data: {"content":"Hello! I'm testing the chat API."}\n\ndata: {"content":" This is a test response."}\n\n`;
		
		return new Response(testResponse, {
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
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
