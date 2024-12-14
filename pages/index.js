const handleSubmit = async () => {
  setIsLoading(true);
  
  try {
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al generar el itinerario');
    }

    let parsedItinerary;
    try {
      parsedItinerary = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      throw new Error('Error al procesar la respuesta del servidor');
    }

    setItinerary(parsedItinerary);
  } catch (error) {
    console.error('Error detallado:', error);
    alert(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};
