export async function GET(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: 'No API key found' }, { status: 400 });
  }

  try {
    // Try direct REST API call
    console.log('Testing Gemini REST API with key:', apiKey.substring(0, 10) + '...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Say hello in one word',
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    return Response.json({
      status: response.status,
      statusText: response.statusText,
      response: data,
      keyFormat: apiKey.substring(0, 5),
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
