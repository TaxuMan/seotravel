import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { destination, specificDay, selectedTravelTypes, budget, withKids } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto planificador de viajes. Genera respuestas JSON detalladas."
        },
        {
          role: "user",
          content: `Genera un itinerario para el día ${specificDay} en ${destination} con:
            - Tipos de actividades: ${selectedTravelTypes.join(', ')}
            - Presupuesto: ${budget}
            - Con niños: ${withKids ? 'Sí' : 'No'}

            Devuelve un JSON con esta estructura exacta:
            {
              "destination": {
                "name": "${destination}",
                "weather": "descripción del clima",
                "bestTimeToVisit": "mejor época para visitar"
              },
              "days": [
                {
                  "day": ${specificDay},
                  "activities": [
                    {
                      "time": "hora de la actividad",
                      "name": "nombre de la actividad",
                      "description": "descripción detallada",
                      "duration": "duración estimada",
                      "cost": "costo aproximado"
                    }
                  ],
                  "meals": [
                    {
                      "time": "hora de la comida",
                      "type": "tipo de comida",
                      "venue": "nombre del restaurante",
                      "cuisine": "tipo de cocina",
                      "priceRange": "rango de precios",
                      "address": "dirección del restaurante"
                    }
                  ]
                }
              ]
            }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const responseData = completion.choices[0].message.content;
    const parsedData = JSON.parse(responseData);
    res.status(200).json(parsedData);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error generando itinerario',
      details: error.message 
    });
  }
}
