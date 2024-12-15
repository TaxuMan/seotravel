export default async function handler(req, res) {
  try {
    const { destination, specificDay } = req.body;

    const prompt = `Genera un itinerario detallado para el día ${specificDay} en ${destination} con el siguiente formato JSON:
    {
      "destination": {
        "name": "${destination}",
        "weather": "clima típico",
        "bestTimeToVisit": "mejor época"
      },
      "days": [
        {
          "day": ${specificDay},
          "activities": [
            {
              "time": "hora",
              "name": "nombre actividad",
              "description": "descripción",
              "duration": "duración",
              "cost": "costo"
            }
          ]
        }
      ]
    }`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: { 
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();
    return res.status(200).json(JSON.parse(data[0].generated_text));

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Error generando itinerario',
      details: error.message
    });
  }
}
