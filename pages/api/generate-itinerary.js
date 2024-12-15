import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Si la llamada a OpenAI falla, usaremos esta respuesta como fallback
    const fallbackResponse = {
      destination: {
        name: req.body.destination || "Ciudad desconocida",
        weather: "Clima agradable",
        bestTimeToVisit: "Primavera"
      },
      days: [
        {
          day: 1,
          activities: [
            {
              time: "09:00",
              name: "Tour por la ciudad",
              description: "Visita guiada por los principales puntos de interés"
            }
          ]
        }
      ]
    };

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Eres un planificador de viajes que genera itinerarios en formato JSON."
          },
          {
            role: "user",
            content: `Crea un itinerario para ${req.body.destination} que incluya:
              - Actividades: ${req.body.selectedTravelTypes.join(', ')}
              - Presupuesto: ${req.body.budget}
              
              Usa exactamente esta estructura JSON:
              {
                "destination": {
                  "name": "nombre ciudad",
                  "weather": "descripción clima",
                  "bestTimeToVisit": "mejor época"
                },
                "days": [
                  {
                    "day": 1,
                    "activities": [
                      {
                        "time": "hora",
                        "name": "nombre actividad",
                        "description": "descripción"
                      }
                    ]
                  }
                ]
              }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const openaiResponse = completion.choices[0].message.content;
      const parsedResponse = JSON.parse(openaiResponse);
      return res.status(200).json(parsedResponse);
    } catch (openaiError) {
      console.error('Error con OpenAI:', openaiError);
      // Si hay un error con OpenAI, usamos la respuesta de fallback
      return res.status(200).json(fallbackResponse);
    }

  } catch (error) {
    console.error('Error del servidor:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor',
      details: error.message
    });
  }
}
