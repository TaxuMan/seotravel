import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Request body:', req.body); // Para debug

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un planificador de viajes que siempre responde en JSON válido."
        },
        {
          role: "user",
          content: `Crea un itinerario para ${req.body.destination} incluyendo:
            - ${req.body.days} días
            - Tipos: ${req.body.selectedTravelTypes.join(', ')}
            - Presupuesto: ${req.body.budget}
            Retorna un JSON con esta estructura exacta:
            {
              "itinerary": {
                "destination": "string",
                "days": [
                  {
                    "day": 1,
                    "activities": [
                      {
                        "time": "string",
                        "name": "string",
                        "description": "string"
                      }
                    ]
                  }
                ]
              }
            }`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Obtener la respuesta y asegurarse de que es JSON válido
    let responseData = completion.choices[0].message.content;
    
    try {
      // Verificar que es JSON válido
      const parsedData = JSON.parse(responseData);
      res.status(200).json(parsedData);
    } catch (parseError) {
      console.error('Error parsing JSON:', responseData);
      res.status(500).json({
        error: 'Invalid JSON response',
        details: parseError.message
      });
    }

  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      details: error.message
    });
  }
}
