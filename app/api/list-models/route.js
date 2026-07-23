import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return Response.json({
        success: false,
        error: 'GEMINI_API_KEY not found'
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list available models
    try {
      const models = await genAI.listModels();
      return Response.json({
        success: true,
        models: models,
        message: 'Available models listed'
      });
    } catch (listError) {
      console.error("ListModels error:", listError.message);
      
      // Try to get at least one model to verify the key works
      const commonModels = [
        'gemini-pro',
        'gemini-1.5-flash', 
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gemini-2.0-pro',
        'gemini-1-pro'
      ];
      
      const results = {};
      for (const modelName of commonModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          results[modelName] = 'Available';
        } catch (err) {
          results[modelName] = `Error: ${err.message.substring(0, 50)}...`;
        }
      }
      
      return Response.json({
        success: false,
        message: 'Could not list models',
        modelTests: results,
        error: listError.message
      });
    }

  } catch (error) {
    console.error("List Models Error:", error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
