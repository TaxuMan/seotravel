import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    // Verificar que tenemos todos los datos necesarios
    console.log('Datos recibidos:', req.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Log para verificar la API key
    console.log('OpenAI configurado:', !!process.env.OPENAI_API_KEY);

    // Crear un objeto de respuesta simple
    const simpleResponse = {
      destination: {
        name: req.body.destination || "Ciudad desconocida",
        weather: "Clima agradable",
        bestTimeToVisit: "Primavera"
      },
      days: [
        {
          day: 1,
          activities: [
            {
              time: "09:00",
              name: "Tour por la ciudad",
              description: "Visita guiada por los principales puntos de interés"
            }
          ]
        }
      ]
    };

    // Por ahora, retornamos la respuesta simple en lugar de llamar a OpenAI
    return res.status(200).json(simpleResponse);

  } catch (error) {
    console.error('Error detallado:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor',
      details: error.message,
      stack: error.stack
    });
  }
}
