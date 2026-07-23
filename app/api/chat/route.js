import { chatWithAI } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Call the Gemini AI with conversation history
    const response = await chatWithAI(message, history || []);

    return Response.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { 
        error: 'Failed to process chat request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return Response.json({ method: 'POST' });
}
