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
        model: "gpt-3.5-turbo", // Cambia a "gpt-4" si tienes acceso
        messages: [
          {
            role: "system",
            content: "You are a travel planner. Always respond with a valid JSON object only. Do not include any explanatory text, just return a JSON object."
          },
          {
            role: "user",
            content: `Generate a travel itinerary for day ${specificDay} in JSON format. The itinerary should be for the destination: ${destination}. Include details such as best time to visit, weather, and a list of activities with time, name, description, duration and cost.`
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
      // Respuesta de fallback si ocurre algún error con OpenAI
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
