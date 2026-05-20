/**
 * Chatbot API Worker
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://amoghravindrarao.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const handleChat = async (request, env) => {
  try {
    const data = await request.json();
    const { message } = data;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'No API key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://amoghravindrarao.vercel.app',
        'X-Title': 'Amogh Portfolio Chatbot',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [
          { role: 'system', content: 'You are AI Amogh, an ML Engineer and Data Scientist.' },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `API error: ${response.status}`, details: errText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export default {
  fetch: (request, env) => {
    const pathname = new URL(request.url).pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Health check
    if (pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    // Chat endpoint
    if (pathname === '/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    // Debug config
    if (pathname === '/debug/config') {
      return new Response(JSON.stringify({ apiKeyConfigured: !!env.OPENROUTER_API_KEY }), { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    });
  },
};
