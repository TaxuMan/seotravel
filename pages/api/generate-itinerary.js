import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { destination, specificDay } = req.body;

    console.log('API Key presente:', !!process.env.OPENAI_API_KEY);
    console.log('Datos recibidos:', { destination, specificDay });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Cambiado a GPT-3.5-turbo
        messages: [
          {
            role: "system",
            content: "You are a travel planner that responds in JSON format."
          },
          {
            role: "user",
            content: "Generate a travel itinerary for day 1 in JSON format"
          }
        ],
        temperature: 0.7
      });

      console.log('Respuesta de OpenAI:', completion.choices[0].message.content);
      
      const parsedResponse = JSON.parse(completion.choices[0].message.content);
      return res.status(200).json(parsedResponse);

    } catch (openaiError) {
      console.error('Error de OpenAI:', openaiError);
      // Respuesta de fallback si falla OpenAI
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
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({
      error: 'Error en el servidor',
      details: error.message
    });
  }
}
