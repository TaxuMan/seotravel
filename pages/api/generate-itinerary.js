import OpenAI from 'openai';

export default async function handler(req, res) {
  // Permitir solo método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Use POST.' });
  }

  // Verificar que el contenido sea JSON
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(400).json({ error: 'Se requiere Content-Type: application/json' });
  }

  const { destination, specificDay } = req.body;

  // Verificar parámetros
  if (!destination || !specificDay) {
    return res.status(400).json({ error: 'Faltan parámetros: destination o specificDay' });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        {
          role: "system",
          content: `
You are a travel planner assistant.
You MUST ONLY output a valid JSON object and NOTHING ELSE.
No explanations, no introductions, no code blocks, no extra text.
The JSON should have this structure:

{
  "destination": {
    "name": "string",
    "bestTimeToVisit": "string",
    "weather": "string"
  },
  "days": [
    {
      "day": number,
      "activities": [
        {
          "time": "string",
          "name": "string",
          "description": "string",
          "duration": "string",
          "cost": "string"
        }
      ]
    }
  ]
}

If you cannot comply, return {}`
        },
        {
          role: "user",
          content: `Generate a travel itinerary for day ${specificDay} for the destination: "${destination}". 
Include best time to visit, weather, and a list of activities with time, name, description, duration, and cost.
Respond ONLY with the JSON object.`
        }
      ],
      temperature: 0
    });

    // Intentar parsear la respuesta como JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      return res.status(500).json({
        error: "La respuesta no es un JSON válido",
        raw: completion.choices[0].message.content
      });
    }

    // Si todo sale bien, devolver el JSON generado
    return res.status(200).json(parsedResponse);

  } catch (openaiError) {
    // Si hay un error con OpenAI, devolver un fallback
    return res.status(200).json({
      destination: {
        name: destination || "Desconocido",
        weather: "Clima mediterráneo",
        bestTimeToVisit: "Primavera"
      },
      days: [{
        day: specificDay || 1,
        activities: [{
          time: "10:00",
          name: "Visita turística",
          description: "Tour por el centro histórico",
          duration: "2 horas",
          cost: "Gratuito"
        }]
      }]
    });
  }
}
