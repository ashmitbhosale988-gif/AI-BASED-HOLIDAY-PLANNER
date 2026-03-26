import OpenAI from 'openai';

// Make sure you have OPENAI_API_KEY in your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination, budget, mood, days, travelType, hiddenGems } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key is missing. Please add it to .env.local' });
  }

  try {
    const prompt = `
      You are an elite, world-class travel planner. I need an itinerary.
      
      Details:
      - Destination: ${destination}
      - Days: ${days}
      - Budget: ${budget}
      - Mood/Vibe: ${mood}
      - Traveler Type: ${travelType}
      - Include Hidden Gems (avoid tourist traps?): ${hiddenGems ? 'Yes, heavily focus on hidden local spots instead of extreme tourist spots.' : 'No, regular famous attractions are fine.'}

      Generate a personalized trip plan. 
      You MUST respond ONLY with a raw JSON object matching the exact structure below. Do not include markdown codeblocks, just the JSON.

      {
        "story": "A short, vivid 2-3 sentence description of how this trip will feel based on the mood.",
        "itinerary": [
          { "day": 1, "plan": "Morning: ..., Afternoon: ..., Evening: ..." },
          { "day": 2, "plan": "..." }
        ],
        "budget": {
          "stay": "Estimated cost/type of accommodation (e.g. $50/night for boutique hostels)",
          "food": "Estimated cost/type of food",
          "transport": "Best ways to get around and cost"
        }
      }
    `;

    // Note: We use gpt-4o-mini as requested for speed and cost efficiency
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful travel assistant that outputs JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }, // Crucial: forces JSON output
    });

    const aiResponse = completion.choices[0].message.content;
    const jsonToReturn = JSON.parse(aiResponse);

    return res.status(200).json(jsonToReturn);

  } catch (error) {
    console.error('OpenAI Error:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary. Check API keys or quota.' });
  }
}
