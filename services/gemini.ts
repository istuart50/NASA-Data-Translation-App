const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export function isConfigured(): boolean {
  return GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && GEMINI_API_KEY.length > 0;
}

async function callGemini(prompt: string): Promise<string> {
  if (!isConfigured()) {
    return 'AI features require a Gemini API key. Add your key in services/gemini.ts to enable this feature.';
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response generated.';
}

export async function simplifyArticle(
  title: string,
  description: string,
  url: string,
  age: number,
): Promise<string> {
  const prompt = `You are a friendly science teacher explaining NASA climate science to a ${age}-year-old student.

The student is reading about this NASA resource:
Title: "${title}"
Description: "${description}"
URL: ${url}

Please explain what this resource is about in simple, fun language that a ${age}-year-old would understand. Use:
- Short sentences
- Everyday comparisons and analogies
- No jargon (or explain any science terms simply)
- An encouraging, curious tone
- Keep it to about 150-200 words

Start with something like "Hey! So this is about..." to make it feel conversational.`;

  return callGemini(prompt);
}

export async function chatAboutArticle(
  title: string,
  description: string,
  question: string,
  age: number,
): Promise<string> {
  const prompt = `You are a friendly, patient science teacher helping a ${age}-year-old student understand NASA climate data.

The student is looking at this NASA resource:
Title: "${title}"
Description: "${description}"

The student asks: "${question}"

Answer their question in a way that's easy for a ${age}-year-old to understand. Use:
- Simple language and short sentences
- Real-world examples they can relate to
- An encouraging tone - no question is silly!
- If you don't know something, say so honestly
- Keep the answer to about 100-150 words`;

  return callGemini(prompt);
}
