import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateItinerary = async (formData) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto planificador de viajes con amplio conocimiento en turismo, transporte público y atracciones turísticas."
        },
        {
          role: "user",
          content: `Genera un itinerario detallado para un viaje a ${formData.destination} con estas características:
            - Duración: ${formData.days} días
            - Tipos de viaje: ${formData.selectedTravelTypes.join(', ')}
            - Presupuesto: ${formData.budget}
            - Viaja con niños: ${formData.withKids ? 'Sí' : 'No'}
            - Alojamiento: ${formData.accommodation.type} en ${formData.accommodation.location}
            - Transporte preferido: ${formData.transportType}

            Incluye para cada actividad:
            - Horarios precisos
            - Ubicaciones exactas
            - Tiempos de desplazamiento
            - Precios de entradas
            - Enlaces oficiales
            - Recomendaciones según el presupuesto`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
};