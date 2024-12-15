export default async function handler(req, res) {
  try {
    const { destination, specificDay } = req.body;
    
    console.log('Token presente:', !!process.env.HF_API_KEY);
    console.log('Datos recibidos:', { destination, specificDay });

    // Usamos un modelo más simple y estable
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        headers: { 
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: `Generate a travel itinerary for ${destination} day ${specificDay}`
        }),
      }
    );

    console.log('Estado de la respuesta:', response.status);
    
    if (!response.ok) {
      throw new Error(`Error de API: ${response.status}`);
    }

    // Devolvemos una respuesta estructurada
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
          name: "Visita guiada",
          description: "Tour por los principales monumentos",
          duration: "2 horas",
          cost: "Gratuito"
        }]
      }]
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return res.status(500).json({
      error: 'Error generando itinerario',
      details: error.message
    });
  }
}
