import OpenAI from 'openai';

export default async function handler(req, res) {
  // Verificar método y content-type
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Use POST.' });
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(400).json({ error: 'Se requiere Content-Type: application/json' });
  }

  const { destination, specificDay } = req.body;

  if (!destination || !specificDay) {
    return res.status(400).json({ error: 'Faltan parámetros: destination o specificDay' });
  }

  console.log('API Key presente:', !!process.env.OPENAI_API_KEY);
  console.log('Datos recibidos:', { destination, specificDay });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Cambia a gpt-4 si tienes acceso
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

    console.log('Respuesta de OpenAI:', completion.choices[0].message.content);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      console.error("No se pudo parsear la respuesta como JSON:", e);
      console.log("Respuesta obtenida:", completion.choices[0].message.content);
      return res.status(500).json({
        error: "La respuesta no es un JSON válido",
        raw: completion.choices[0].message.content
      });
    }

    return res.status(200).json(parsedResponse);

  } catch (openaiError) {
    console.error('Error de OpenAI:', openaiError);
    // Respuesta de fallback
    return res.status(200).json({
      destination: {
        name: destination,
        weather: "Clima mediterráneo",
        bestTimeToVisit: "Primavera"
      },
      days: [{
        day: specificDay,
        activities: [{
          time: "10:00",
          name: "Visita turística",
          description: "Tour por el centro",
          duration: "2 horas",
          cost: "Gratuito"
        }]
      }]
    });
  }
}
