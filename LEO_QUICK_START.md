# 🤖 LEO AI Chatbot - Quick Start Guide

## ✅ What's Been Created

Your DarkKnight project now has a fully-functional AI chatbot named **LEO** that can answer ANY type of questions!

### Files Created/Updated:
1. ✅ `/app/api/chat/route.js` - Chat API endpoint
2. ✅ `/app/dashboard/chat/page.js` - Enhanced chat interface
3. ✅ `/lib/gemini.js` - AI logic with improved prompts
4. ✅ `.env.local` - Configuration file (already has API key)

## 🚀 How to Use

### Start the server:
```bash
npm run dev
```

### Access the chatbot:
Visit: **http://localhost:3001/dashboard/chat**

### Ask questions about:
- 💼 Jobs, internships, hackathons, research
- 📚 Learning, programming, development
- 💡 Technical questions and concepts
- 🎯 General advice and guidance
- 📖 Anything else!

## ⚙️ Configuration

Your API key is already configured in `.env.local`:
```
GEMINI_API_KEY=sk-proj-...
```

## 🔧 How It Works

1. User types a message in the chat box
2. Message sent to `/api/chat` endpoint
3. Endpoint calls Google Gemini AI
4. AI responds with intelligent answer
5. Response displayed in chat UI
6. Conversation history maintained for context

## ✨ Features

- 🔄 Real-time AI responses
- 💬 Conversation history maintained
- 🎨 Beautiful, responsive UI
- 📱 Mobile-friendly design
- 🌙 Dark theme integrated
- ⚡ Fast responses (Gemini Flash model)
- 🛡️ Error handling & fallbacks

## 🔍 Troubleshooting

### If you see: "Error processing your request"

**Check these in order:**

1. **API Key Valid?**
   ```bash
   # Check .env.local exists
   cat .env.local
   ```
   Should contain: `GEMINI_API_KEY=...`

2. **Correct API Key Format?**
   - Gemini API keys are provided at https://aistudio.google.com/apikey
   - Usually very long string starting with specific pattern

3. **API Quota?**
   - Go to https://aistudio.google.com/
   - Check your usage and quota

4. **Network Connection?**
   - Ensure you have internet access
   - Check if API endpoint is reachable

## 📝 Customization

### Change the Welcome Message
Edit `/app/dashboard/chat/page.js`:
```javascript
// Line: Welcome to LEO AI! 🤖
// Change this text to customize welcome message
```

### Change AI Behavior
Edit `/lib/gemini.js`:
```javascript
const systemPrompt = `You are LEO AI, ...`;
// Modify this to change how AI responds
```

### Use Different Model
In `/lib/gemini.js`, change:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// Options: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
```

## 📚 Full Documentation

See **LEO_CHATBOT_GUIDE.md** for:
- Complete technical details
- API endpoint documentation
- Advanced customization
- Potential enhancements
- Troubleshooting guide

## 🎯 Next Steps

1. ✅ Start the dev server
2. ✅ Go to dashboard/chat
3. ✅ Ask LEO any question!
4. 📝 Customize as needed
5. 🚀 Deploy to production

## 🎓 Examples to Try

```
"What is machine learning?"
"Help me find a React internship"
"How do I become a better programmer?"
"What are the best Python libraries?"
"Explain quantum computing"
"What hackathons are happening?"
```

## 📞 Support

- 📖 Check browser console (F12) for detailed errors
- 🔗 Visit https://ai.google.dev for Gemini docs
- 📝 Check LEO_CHATBOT_GUIDE.md for full documentation
- 🐛 Check terminal output for server errors

---

**Status**: ✅ Ready to Use
**AI Model**: Google Gemini 1.5 Flash
**Chatbot Name**: LEO AI
**Date**: July 23, 2026
