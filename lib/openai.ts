import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(content: string, prompt: string): Promise<string> {
  console.log('[OpenAI] Starting content generation');
  console.log('[OpenAI] Prompt length:', prompt.length);
  console.log('[OpenAI] Content length:', content.length);

  try {
    console.log('[OpenAI] Making API request...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a social media content expert. Return responses in JSON format only with a 'content' key."
        },
        {
          role: "user",
          content: prompt + content
        }
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    console.log('[OpenAI] Received response');
    
    if (!result) {
      console.error('[OpenAI] No content in response');
      throw new Error('No content generated');
    }

    try {
      console.log('[OpenAI] Attempting to parse JSON response');
      const jsonResponse = JSON.parse(result);
      if (!jsonResponse.content) {
        console.error('[OpenAI] Missing content key in JSON response:', jsonResponse);
        throw new Error('Invalid response format');
      }
      console.log('[OpenAI] Successfully parsed JSON response');
      return jsonResponse.content;
    } catch (e) {
      console.error('[OpenAI] JSON parsing failed. Raw response:', result);
      console.log('[OpenAI] Attempting to clean raw response');
      // If JSON parsing fails, try to return the raw content
      return result.replace(/["{}\n]/g, '').replace(/^content:\s*/i, '').trim();
    }
  } catch (error) {
    console.error('[OpenAI] API error:', error);
    if (error instanceof Error) {
      console.error('[OpenAI] Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw error;
  }
} 