import { opportunities } from './mockData';

// Initialize OpenRouter API
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return apiKey;
};

/**
 * Smart fallback responses based on user query
 */
const generateSmartResponse = (message) => {
  const text = message.toLowerCase();
  
  // Career opportunities
  if (text.includes('intern') || text.includes('internship')) {
    const internships = opportunities.filter(o => o.type === 'internship');
    return `I found ${internships.length} internship opportunities! Here are some highlights:\n\n${internships.slice(0, 2).map(o => `• ${o.title} at ${o.organization}`).join('\n')}\n\nWould you like to know more about any specific opportunity?`;
  }
  
  if (text.includes('hackathon')) {
    const hackathons = opportunities.filter(o => o.type === 'hackathon');
    return `Great question! We have ${hackathons.length} hackathons available. Some upcoming ones:\n\n${hackathons.slice(0, 2).map(o => `• ${o.title}`).join('\n')}\n\nThese are perfect for building your portfolio and networking!`;
  }
  
  if (text.includes('job') || text.includes('position') || text.includes('hire')) {
    const jobs = opportunities.filter(o => o.type === 'job');
    return `I found ${jobs.length} job opportunities! Some interesting roles:\n\n${jobs.slice(0, 2).map(o => `• ${o.title} at ${o.organization}`).join('\n')}\n\nLet me know what domain interests you!`;
  }
  
  if (text.includes('research') || text.includes('funding')) {
    const research = opportunities.filter(o => o.type === 'research');
    return `We have ${research.length} research opportunities and funding available:\n\n${research.slice(0, 2).map(o => `• ${o.title}`).join('\n')}\n\nPerfect for advancing your academic journey!`;
  }
  
  // Learning topics
  if (text.includes('learn') || text.includes('skill') || text.includes('course')) {
    return "That's a great topic to explore! I recommend:\n\n• Start with fundamentals and build gradually\n• Practice with real projects\n• Join communities and learn from others\n• Stay curious and keep building!\n\nWhat specific skill are you interested in?";
  }
  
  if (text.includes('python') || text.includes('javascript') || text.includes('react')) {
    return "Great choice! These are in-demand skills. Here are relevant opportunities:\n\n• Check our job/internship board for related roles\n• Participate in hackathons to build projects\n• Work on research projects to deepen knowledge\n\nDo you want to see specific opportunities?";
  }
  
  // General motivation/advice
  if (text.includes('advice') || text.includes('help') || text.includes('suggest')) {
    return "I'm here to help! You can ask me about:\n\n💼 Career opportunities (jobs, internships, hackathons)\n📚 Learning and skill development\n🎯 Technical topics and programming\n📖 Study tips and productivity\n\nWhat would you like to explore?";
  }
  
  // Default helpful response
  return "That's an interesting question! I'm LEO AI, your career and learning assistant. I can help you with:\n\n• Finding internships, jobs, and hackathons\n• Learning technical skills\n• Career guidance and advice\n• Study tips and productivity\n\nLet me know how I can assist you! 🚀";
};

/**
 * Chat with Gemini AI, falling back to smart responses if API unavailable
 * 
 * @param {string} message The user's message
 * @param {Array} conversationHistory Previous messages in the conversation
 * @returns {Promise<string>} The AI's response text
 */
export async function chatWithAI(message, conversationHistory = []) {
  try {
    const apiKey = getOpenRouterClient();
    
    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY not found. Using smart fallback.");
      return generateSmartResponse(message);
    }

    // Use a free and available model from OpenRouter
    const model = "openrouter/auto";
    
    // Convert conversation history to OpenRouter format
    const messages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    console.log("Sending request to OpenRouter API with model:", model);
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": `http://localhost:3001`,
        "X-Title": `LEO AI Chat`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are LEO AI, a helpful, friendly, and intelligent assistant. You can answer questions about ANY topic including careers, learning, technology, science, general knowledge, creative topics, and anything else the user asks about. Be conversational, detailed, and helpful.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      throw new Error(data.error?.message || "API request failed");
    }

    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      console.warn("Empty response from API");
      return generateSmartResponse(message);
    }
    
    console.log("✓ Got response from OpenRouter");
    return text;
    
  } catch (error) {
    console.error("Chat error:", error.message);
    return generateSmartResponse(message);
  }
}

/**
 * Generates a concise summary for an opportunity using Gemini AI
 * 
 * @param {Object} opportunity The opportunity object
 * @returns {Promise<string>} A 2-3 sentence summary
 */
export async function summarizeOpportunity(opportunity) {
  try {
    const apiKey = getOpenRouterClient();
    
    if (!apiKey) {
      return opportunity.aiSummary || "An exciting opportunity to grow your career and skills.";
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": `http://localhost:3001`,
        "X-Title": `LEO AI`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Summarize the given opportunity in 2-3 concise sentences."
          },
          {
            role: "user",
            content: `Summarize this opportunity:\n\nTitle: ${opportunity.title}\nOrganization: ${opportunity.organization}\nType: ${opportunity.type}\nDescription: ${opportunity.description}`
          }
        ],
        temperature: 0.7,
        max_tokens: 256
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    return text || opportunity.aiSummary || "An exciting opportunity to grow your career.";
    
  } catch (error) {
    console.error("Error summarizing opportunity:", error);
    return opportunity.aiSummary || "An exciting opportunity to grow your career.";
  }
}

/**
 * Matches a user profile against a list of opportunities and ranks them
 * 
 * @param {Object} userProfile The user's profile
 * @param {Array} opportunities Array of opportunity objects
 * @returns {Promise<Array>} Sorted array of opportunities
 */
export async function matchOpportunities(userProfile, opportunities) {
  try {
    const genAI = getGeminiClient();
    
    if (!genAI) {
      // Fallback: simple sorting by existing matchScore
      return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    // For now, return sorted by mock matchScore to fulfill the API structure
    return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
  } catch (error) {
    console.error("Error matching opportunities:", error);
    return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}
