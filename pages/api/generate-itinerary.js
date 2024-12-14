import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a travel planner API that responds only with valid JSON."
        },
        {
          role: "user",
          content: `Create a travel itinerary for ${req.body.destination} with the following specifications:
            Duration: ${req.body.days} days
            Travel types: ${req.body.selectedTravelTypes.join(', ')}
            Budget: ${req.body.budget}
            With children: ${req.body.withKids ? 'Yes' : 'No'}
            Return the response in this exact JSON structure:
            {
              "destination": {
                "name": "string",
                "weather": "string",
                "bestTimeToVisit": "string"
              },
              "days": [
                {
                  "day": 1,
                  "activities": [
                    {
                      "time": "string",
                      "name": "string",
                      "description": "string",
                      "location": {
                        "address": "string"
                      },
                      "duration": "string",
                      "cost": "string"
                    }
                  ],
                  "meals": [
                    {
                      "type": "string",
                      "time": "string",
                      "venue": "string",
                      "cuisine": "string",
                      "priceRange": "string",
                      "address": "string"
                    }
                  ]
                }
              ]
            }`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Intentar parsear la respuesta antes de enviarla
    const response = completion.choices[0].message.content;
    JSON.parse(response); // Esto verificará que es JSON válido
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error generating itinerary', 
      details: error.message 
    });
  }
}
