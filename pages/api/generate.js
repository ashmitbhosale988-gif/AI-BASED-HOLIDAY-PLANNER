import Groq from 'groq-sdk';

// Initialize Groq client using the GROQ_API_KEY from your .env file
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination, budget, mood, days, travelType, hiddenGems } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'Missing required fields: destination and days are required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is missing. Please add it to your .env file.' });
  }

  try {
    const prompt = `
You are an elite, world-class travel planner. Generate a personalized trip plan based on these details:

- Destination: ${destination}
- Number of Days: ${days}
- Budget: ${budget} (low = backpacking, medium = comfort, luxury = premium)
- Mood/Vibe: ${mood}
- Traveler Type: ${travelType}
- Focus on Hidden Gems (avoid tourist traps): ${hiddenGems ? 'YES - heavily prefer off-the-beaten-path, local hidden gems over mainstream tourist spots.' : 'NO - popular attractions are fine.'}

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code blocks. Just the raw JSON.

The JSON must follow this exact structure:
{
  "story": "A vivid, emotional 2-3 sentence description of how this trip will feel — describe the atmosphere, senses, and mood.",
  "itinerary": [
    { "day": 1, "plan": "Morning: [activity]. Afternoon: [activity]. Evening: [activity]." },
    { "day": 2, "plan": "Morning: [activity]. Afternoon: [activity]. Evening: [activity]." }
  ],
  "budget": {
    "stay": "Type and estimated cost of accommodation per night (e.g. Cozy guesthouses ~$30-50/night)",
    "food": "Type and estimated daily food cost (e.g. Street food and local cafes ~$10-20/day)",
    "transport": "Best transport options and estimated cost (e.g. Metro + tuk-tuks ~$5-10/day)"
  }
}

Generate exactly ${days} days in the itinerary array.
    `;

    // Using llama-3.3-70b-versatile — one of Groq's fastest, most capable free models
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional travel planner. You always respond with valid JSON only. Never include markdown code blocks or any text outside the JSON object.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const aiResponse = completion.choices[0].message.content.trim();

    // Clean up any accidental markdown code fences just in case
    const cleanResponse = aiResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const jsonToReturn = JSON.parse(cleanResponse);

    return res.status(200).json(jsonToReturn);

  } catch (error) {
    console.error('Groq API Error:', error);

    // Return a more descriptive error message to help with debugging
    return res.status(500).json({
      error: error?.message || 'Failed to generate itinerary. Please check your GROQ_API_KEY and try again.',
    });
  }
}
