export default {
  fetch: async (request) => {
    const pathname = new URL(request.url).pathname;
    
    if (pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/chat' && request.method === 'POST') {
      return new Response(
        `data: {"content":"Hello from test worker"}\n\n`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
