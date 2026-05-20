# Chatbot Worker Setup Guide

## Overview
This guide explains how to set up and deploy the AI chatbot backend using Cloudflare Workers + OpenRouter.

## Prerequisites
1. **Cloudflare Account** - [Sign up free](https://dash.cloudflare.com/sign-up)
2. **OpenRouter API Key** - [Get one here](https://openrouter.ai/keys)
3. **Wrangler CLI** - Already installed if you have Node.js

## Step 1: Get OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up / Log in
3. Go to **Keys** section
4. Create a new API key
5. Copy the key (you'll use it next)

## Step 2: Deploy the Chatbot Worker

### Option A: Deploy to Cloudflare (Recommended for Production)

```bash
# Install/update Wrangler
npm install -g @cloudflare/wrangler

# Set the OpenRouter API key as a secret
wrangler secret put OPENROUTER_API_KEY --config wrangler-chatbot.toml

# When prompted, paste your OpenRouter API key

# Deploy the worker
wrangler publish --config wrangler-chatbot.toml
```

**Note:** Wrangler will ask you to authenticate. You can use:
```bash
wrangler login
```

### Output
After successful deployment, you'll see:
```
✓ Uploaded chatbot-api (x.xx KiB)
✓ Deployed to https://chatbot-api.amoghraor.workers.dev
```

Save this URL! Update your `.env.local` and `.env.production` if different.

## Step 3: Update Environment Variables

Update `/.env.local`:
```env
VITE_CHATBOT_API_URL=https://chatbot-api.amoghraor.workers.dev
```

If deploying to production, also update `/.env.production`:
```env
VITE_CHATBOT_API_URL=https://chatbot-api.amoghraor.workers.dev
```

## Step 4: Test Locally (Development)

For local testing during development, the frontend fallback is `http://localhost:8787`:

```bash
# Terminal 1: Start the Wrangler local server
wrangler dev --config wrangler-chatbot.toml

# Terminal 2: Start the dev server
npm run dev
```

Then visit `http://localhost:5173/chat` and test the chatbot.

## Step 5: Verify Deployment

Test the worker endpoint:
```bash
# Health check
curl https://chatbot-api.amoghraor.workers.dev/health

# Should return: {"status":"ok"}

# Test chat (requires valid message)
curl -X POST https://chatbot-api.amoghraor.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","conversationHistory":[]}'
```

## Troubleshooting

### "Failed to fetch" error
- **Check:** Worker is deployed and accessible
- **Fix:** Run `wrangler publish --config wrangler-chatbot.toml` again

### API key not found
- **Check:** Secret was set correctly
- **Fix:** Run `wrangler secret put OPENROUTER_API_KEY --config wrangler-chatbot.toml` again

### CORS errors
- **Check:** Request origin is in the allowed list (Sidebar.tsx line ~60)
- **Fix:** Add your domain to `ALLOWED_ORIGINS` in `worker/chatbot.js`

### Streaming not working
- **Check:** Browser supports ReadableStream (all modern browsers)
- **Fallback:** The API also supports non-streaming mode (automatic fallback)

## Cost Estimation

OpenRouter pricing varies by model. Using the "openrouter/auto" setting:
- **Typical cost:** $0.001 - $0.01 per message (varies by model)
- **Free tier available:** Limited free credits for testing

[Check OpenRouter pricing](https://openrouter.ai/docs/pricing)

## Next Steps

1. ✅ Deploy the worker
2. ✅ Set the API key
3. ✅ Update environment variables
4. 🎉 Start chatting!

## Useful Links

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/docs/models)

## Environment Variables Reference

### Backend Environment (Cloudflare Secret)
- `OPENROUTER_API_KEY` - Your OpenRouter API key (set via `wrangler secret put`)

### Frontend Environment (.env.local)
- `VITE_CHATBOT_API_URL` - URL to the deployed worker
  - Production: `https://chatbot-api.amoghraor.workers.dev`
  - Development: `http://localhost:8787` (fallback)
