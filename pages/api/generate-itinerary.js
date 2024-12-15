import { predefinedDestinations } from '../../data/destinations';
import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const { destination, specificDay } = req.body;
    const destinationKey = destination.toLowerCase();

    // Verificar si tenemos el destino predefinido
    if (predefinedDestinations[destinationKey]) {
      const predefinedData = predefinedDestinations[destinationKey];
      
      // Devolver solo el día específico solicitado
      return res.status(200).json({
        destination: predefinedData.destination,
        days: predefinedData.days.filter(day => day.day === specificDay)
      });
    }

    // Si no está predefinido, usar OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un experto planificador de viajes."
        },
        {
          role: "user",
          content: `Genera un itinerario para el día ${specificDay} en ${destination}.`
        }
      ]
    });

    // Procesar la respuesta de OpenAI
    // ... código para procesar la respuesta ...

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Error generando itinerario',
      details: error.message
    });
  }
}
