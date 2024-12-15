import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('Request body:', req.body); // Para debug

    // Respuesta estática para pruebas
    const testResponse = {
      destination: {
        name: req.body.destination,
        weather: "Templado oceánico. Inviernos fríos y veranos suaves.",
        bestTimeToVisit: "Abril a Junio y Octubre a principios de Noviembre"
      },
      days: [
        {
          day: req.body.specificDay || 1,
          activities: [
            {
              time: "10:00",
              name: "Paseo por el centro",
              description: "Tour guiado por los principales monumentos",
              duration: "2 horas",
              cost: "Gratuito"
            }
          ]
        }
      ]
    };

    // Primero intentamos con una respuesta estática
    return res.status(200).json(testResponse);

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor',
      message: error.message,
      stack: error.stack 
    });
  }
}
