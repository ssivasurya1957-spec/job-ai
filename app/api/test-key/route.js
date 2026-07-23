import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log("Testing API Key...");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key starts with:", apiKey?.substring(0, 10) + "...");
    
    if (!apiKey) {
      return Response.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment variables',
        details: 'Make sure .env.local file has GEMINI_API_KEY set'
      }, { status: 400 });
    }

    // Initialize the client
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("GoogleGenerativeAI client created");
    
    // Try different models
    const modelNames = ['gemini-pro'];
    let workingModel = null;
    const modelTestResults = {};
    
    for (const modelName of modelNames) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const testResult = await model.generateContent("Say 'API works!' in one line.");
        const testResponse = await testResult.response;
        const text = testResponse.text();
        workingModel = modelName;
        modelTestResults[modelName] = { status: 'SUCCESS', response: text.substring(0, 50) };
        console.log(`✓ Model ${modelName} works!`);
        break;
      } catch (err) {
        modelTestResults[modelName] = { 
          status: 'FAILED', 
          error: err.message.substring(0, 100) 
        };
        console.warn(`✗ Model ${modelName} failed:`, err.message);
      }
    }
    
    if (!workingModel) {
      throw new Error('No working model found. Results: ' + JSON.stringify(modelTestResults));
    }
    
    return Response.json({
      success: true,
      message: "API Key is working correctly!",
      workingModel: workingModel,
      modelTests: modelTestResults,
      apiKeyFormat: apiKey.substring(0, 20) + "...",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("API Test Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    
    return Response.json({
      success: false,
      error: 'API Test Failed',
      details: error.message,
      errorType: error.constructor.name,
      fullError: error.toString()
    }, { status: 500 });
  }
}
