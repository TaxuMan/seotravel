export default async function handler(req, res) {
  try {
    // Log para verificar que recibimos los datos
    console.log('API Key presente:', !!process.env.HF_API_KEY);
    console.log('Datos recibidos:', req.body);

    // Respuesta estática de prueba
    return res.status(200).json({
      destination: {
        name: req.body.destination || "Ciudad",
        weather: "Clima mediterráneo",
        bestTimeToVisit: "Primavera"
      },
      days: [
        {
          day: 1,
          activities: [
            {
              time: "10:00",
              name: "Visita al centro",
              description: "Tour por la ciudad",
              duration: "2 horas",
              cost: "Gratuito"
            }
          ]
        }
      ]
    });

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor',
      message: error.message 
    });
  }
}
