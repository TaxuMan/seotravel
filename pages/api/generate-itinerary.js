import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { destination, days, selectedTravelTypes, budget, withKids, accommodation, transportType } = req.body;

    const prompt = `Actúa como un experto local y guía turístico profesional para ${destination}. 
    Genera un itinerario detallado y realista en JSON que incluya:

    Perfil del viaje:
    - Destino: ${destination}
    - Duración: ${days} días
    - Intereses: ${selectedTravelTypes.join(', ')}
    - Presupuesto: ${budget}
    - Viajando con niños: ${withKids ? 'Sí' : 'No'}
    - Alojamiento preferido: ${accommodation.type} en ${accommodation.location}
    - Transporte preferido: ${transportType}

    Como experto local, proporciona:
    1. Zonas recomendadas para alojarse según las preferencias
    2. Atracciones principales y ocultas que coincidan con los intereses
    3. Restaurantes locales auténticos en el rango de precio adecuado
    4. Tips de transporte local y cómo moverse eficientemente
    5. Horarios realistas considerando tráfico y tiempos de espera
    6. Consejos culturales y locales específicos
    7. ${withKids ? 'Actividades y lugares apropiados para niños' : 'Experiencias más especializadas'}
    8. Recomendaciones de seguridad y zonas a evitar
    9. Enlaces a sitios oficiales para reservas
    10. Alternativas para mal tiempo

    Estructura el itinerario en este formato JSON exacto:
    {
      "destination": {
        "name": string,
        "localTips": string[],
        "bestTimeToVisit": string,
        "weather": string,
        "localTransport": {
          "options": string[],
          "recommendations": string[],
          "cards": string[],
          "apps": string[]
        }
      },
      "accommodation": {
        "area": string,
        "recommendations": string[],
        "safetyTips": string[],
        "nearbyAmenities": string[],
        "transportConnections": string[]
      },
      "days": [
        {
          "day": number,
          "weather": string,
          "activities": [
            {
              "time": string,
              "name": string,
              "description": string,
              "type": string[],
              "location": {
                "address": string,
                "area": string,
                "coordinates": string
              },
              "duration": string,
              "cost": string,
              "bookingNeeded": boolean,
              "bookingUrl": string,
              "crowdLevel": string,
              "bestTimeToVisit": string,
              "kidsFriendly": boolean,
              "localTips": string[],
              "transport": {
                "from": string,
                "options": [
                  {
                    "type": string,
                    "duration": string,
                    "cost": string,
                    "details": string
                  }
                ]
              }
            }
          ],
          "meals": [
            {
              "type": string,
              "time": string,
              "venue": string,
              "cuisine": string,
              "priceRange": string,
              "address": string,
              "reservationNeeded": boolean,
              "reservationUrl": string,
              "recommendations": string[],
              "localTips": string[]
            }
          ]
        }
      ],
      "emergencyInfo": {
        "police": string,
        "ambulance": string,
        "tourist_police": string,
        "nearby_hospitals": string[]
      },
      "budget": {
        "estimated_daily_cost": string,
        "breakdown": {
          "accommodation": string,
          "food": string,
          "activities": string,
          "transport": string
        },
        "money_saving_tips": string[]
      }
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto planificador de viajes con conocimiento global de destinos turísticos. Genera respuestas en JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    res.status(200).json(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ 
      message: 'Error generating itinerary',
      error: error.message,
      details: error.stack
    });
  }
}