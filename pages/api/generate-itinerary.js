import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { destination, days, selectedTravelTypes, budget, withKids, accommodation, transportType } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto planificador de viajes. Proporciona respuestas en formato JSON válido."
        },
        {
          role: "user",
          content: `Crea un itinerario detallado en JSON para ${destination} con estas características:
          - Duración: ${days} días
          - Tipos: ${selectedTravelTypes.join(', ')}
          - Presupuesto: ${budget}
          - Niños: ${withKids ? 'Sí' : 'No'}
          - Alojamiento: ${accommodation.type} en ${accommodation.location}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    
    // Verificar que la respuesta es JSON válido
    try {
      JSON.parse(content);
      res.status(200).json(content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', content);
      res.status(500).json({ 
        error: 'Invalid JSON response from OpenAI',
        details: parseError.message
      });
    }

  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ 
      error: error.message || 'Error generating itinerary',
      details: error.stack
    });
  }
}
