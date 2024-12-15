import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { destination, specificDay, selectedTravelTypes, budget } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto local en turismo que genera itinerarios detallados. Proporciona información específica y práctica para cada actividad."
        },
        {
          role: "user",
          content: `Genera un itinerario detallado para el día ${specificDay} en ${destination}. 
          Intereses: ${selectedTravelTypes.join(', ')}
          Presupuesto: ${budget}
          
          La respuesta debe ser un JSON con esta estructura exacta:
          {
            "destination": {
              "name": "${destination}",
              "weather": "descripción del clima típico",
              "bestTimeToVisit": "mejor época para visitar"
            },
            "days": [
              {
                "day": ${specificDay},
                "activities": [
                  {
                    "time": "hora (formato HH:MM)",
                    "name": "nombre de la actividad",
                    "description": "descripción detallada",
                    "duration": "duración en horas",
                    "cost": "costo con precio específico"
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

    const data = completion.choices[0].message.content;
    const parsedData = JSON.parse(data);
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Error generando itinerario',
      details: error.message
    });
  }
}
