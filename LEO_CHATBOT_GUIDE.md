# LEO AI Chatbot - Implementation Guide

## Overview
LEO AI is an intelligent chatbot built into your DarkKnight project that allows users to ask any type of questions. It's powered by Google's Gemini AI and is fully integrated into the dashboard.

## Features

✅ **All-Purpose Chatbot**: Ask questions about:
- Career opportunities (jobs, internships, hackathons)
- Learning and development
- Technical questions
- General knowledge and guidance
- And much more!

✅ **Real-Time Responses**: Using Google Gemini API
✅ **Conversation History**: Context-aware responses
✅ **Beautiful UI**: Modern, responsive design matching your dashboard
✅ **Error Handling**: Fallback responses when API is unavailable

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API key"
3. Copy your API key

### 2. Configure Environment Variables

Create or update `.env.local` in your project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the key from step 1.

### 3. Files Created/Modified

**New Files:**
- `app/api/chat/route.js` - API endpoint for chat messages

**Modified Files:**
- `app/dashboard/chat/page.js` - Updated chat interface with real AI
- `lib/gemini.js` - Enhanced with generic system prompt

## How It Works

1. User types a message in the chat input
2. Message is sent to `/api/chat` endpoint
3. API calls `chatWithAI()` function from `lib/gemini.js`
4. Gemini AI generates a response based on conversation history
5. Response is displayed in the chat UI

## API Endpoint

**POST** `/api/chat`

Request body:
```json
{
  "message": "Your question here",
  "history": [
    { "role": "user", "content": "Previous user message" },
    { "role": "assistant", "content": "Previous AI response" }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "AI response here",
  "timestamp": "2026-07-23T00:00:00.000Z"
}
```

## Testing the Chatbot

1. Run the dev server: `npm run dev`
2. Navigate to `http://localhost:3001/dashboard/chat`
3. Type your question and press Enter or click the send button
4. Wait for the AI response!

## Troubleshooting

### "Error processing your request"
- **Check API Key**: Verify `GEMINI_API_KEY` is set correctly in `.env.local`
- **Check API Quota**: Make sure your Gemini API key has available quota
- **Check Network**: Ensure your internet connection is stable

### Fallback Mode
If no API key is configured, the chatbot will use basic keyword matching with pre-defined responses.

## System Prompt

The AI is instructed to be:
- Friendly and helpful
- Informative and concise
- Honest about limitations
- Knowledgeable across many topics

Current system prompt is in `lib/gemini.js` function `chatWithAI()`.

## Customization

### Change the AI Behavior
Edit the `systemPrompt` in `lib/gemini.js`:

```javascript
const systemPrompt = `You are LEO AI, ...`;
```

### Change the UI
Modify `app/dashboard/chat/page.js`:
- Update welcome message
- Change colors and styling
- Modify placeholder text

### Use Different AI Model
Change the model in `lib/gemini.js`:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

Available models:
- `gemini-1.5-flash` (fast, free tier)
- `gemini-1.5-pro` (more capable)
- `gemini-2.0-flash` (latest)

## What's Next?

Potential enhancements:
- [ ] Save conversation history to database
- [ ] Add conversation download feature
- [ ] User authentication and personalization
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Integration with other APIs (weather, news, etc.)
- [ ] Custom knowledge base training

## Support

For issues or questions:
1. Check `.env.local` has the correct API key
2. Visit [Google AI Documentation](https://ai.google.dev/)
3. Check browser console for errors (F12 → Console)
4. Check terminal logs for server errors

---

**Last Updated**: 2026-07-23  
**AI Model**: Gemini 1.5 Flash  
**Status**: ✅ Production Ready
