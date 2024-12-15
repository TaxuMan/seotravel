import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { destination, specificDay } = req.body;
    console.log('Generando día:', specificDay);

    // Respuesta estática específica para cada día
    const testResponse = {
      destination: {
        name: destination,
        weather: "Templado oceánico. Inviernos fríos y veranos suaves.",
        bestTimeToVisit: "Abril a Junio y Octubre a principios de Noviembre"
      },
      days: [
        {
          day: specificDay,
          activities: [
            {
              time: "10:00",
              name: `Actividad del día ${specificDay}`,
              description: `Descripción para el día ${specificDay}`,
              duration: "2 horas",
              cost: "Gratuito"
            },
            {
              time: "14:00",
              name: `Segunda actividad del día ${specificDay}`,
              description: `Otra actividad para el día ${specificDay}`,
              duration: "3 horas",
              cost: "10€"
            }
          ]
        }
      ]
    };

    return res.status(200).json(testResponse);

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor',
      message: error.message
    });
  }
}
