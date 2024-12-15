import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const basicResponse = {
      destination: {
        name: req.body.destination,
        weather: "Soleado",
        bestTimeToVisit: "Primavera"
      },
      days: [
        {
          day: 1,
          activities: [
            {
              time: "09:00",
              name: "Visita turística",
              description: "Tour por el centro"
            }
          ]
        }
      ]
    };

    // Primero probamos retornando una respuesta fija
    return res.status(200).json(basicResponse);

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor',
      message: error.message
    });
  }
}
