import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto planificador de viajes. Genera respuestas en JSON."
        },
        {
          role: "user",
          content: `Genera un itinerario para ${req.body.destination} con estas características:
            - ${req.body.days} días
            - Intereses: ${req.body.selectedTravelTypes.join(', ')}
            - Presupuesto: ${req.body.budget}
            El formato debe ser EXACTAMENTE:
            {
              "destination": {
                "name": "${req.body.destination}",
                "weather": "descripción del clima",
                "bestTimeToVisit": "mejor época"
              },
              "days": [
                {
                  "day": 1,
                  "activities": [
                    {
                      "time": "hora",
                      "name": "nombre de la actividad",
                      "description": "descripción detallada"
                    }
                  ]
                }
              ]
            }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const responseData = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: error.message
    });
  }
}
