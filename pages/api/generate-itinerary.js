export default async function handler(req, res) {
  try {
    const { destination, specificDay } = req.body;
    
    console.log('Token presente:', !!process.env.HF_API_KEY);
    console.log('Datos recibidos:', { destination, specificDay });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: { 
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: `Actúa como un experto en viajes y genera un itinerario en formato JSON para ${destination}.`
        }),
      }
    );

    console.log('Estado de la respuesta:', response.status);
    const responseData = await response.text();
    console.log('Respuesta completa:', responseData);

    // Si llegamos aquí sin error, probamos a parsear la respuesta
    try {
      const jsonData = JSON.parse(responseData);
      return res.status(200).json(jsonData);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      // Si falla el parsing, devolvemos una respuesta de fallback
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
            name: "Tour por la ciudad",
            description: "Visita guiada por los principales monumentos",
            duration: "2 horas",
            cost: "Gratuito"
          }]
        }]
      });
    }

  } catch (error) {
    console.error('Error detallado:', error);
    return res.status(500).json({
      error: 'Error generando itinerario',
      details: error.message
    });
  }
}
