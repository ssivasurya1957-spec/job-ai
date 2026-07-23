export async function GET(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return Response.json({ error: 'No API key' }, { status: 400 });
    }

    // Try a direct API call to check available models
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models', {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey,
      }
    });

    const data = await response.json();
    
    return Response.json({
      success: true,
      statusCode: response.status,
      data: data
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
