// pages/api/generate-itinerary.js
export default async function handler(req, res) {
  try {
    const { destination, specificDay } = req.body;

    // Respuesta estática de prueba
    const staticResponse = {
      destination: {
        name: destination || "Ciudad",
        weather: "Clima mediterráneo",
        bestTimeToVisit: "Primavera"
      },
      days: [
        {
          day: specificDay || 1,
          activities: [
            {
              time: "10:00",
              name: "Visita al centro histórico",
              description: "Recorrido por los principales monumentos",
              duration: "2 horas",
              cost: "Gratuito"
            },
            {
              time: "14:00",
              name: "Almuerzo en restaurante local",
              description: "Gastronomía típica",
              duration: "1.5 horas",
              cost: "30€ por persona"
            }
          ]
        }
      ]
    };

    return res.status(200).json(staticResponse);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
}
