import { useState } from 'react';
import Itinerary from '../components/Itinerary';

export default function Home() {
  const [destination, setDestination] = useState('');
  const [specificDay, setSpecificDay] = useState('');
  const [itinerary, setItinerary] = useState(null);

  async function handleClick() {
    if (!destination || !specificDay) {
      alert('Por favor, ingresa un destino y un día.');
      return;
    }

    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, specificDay: Number(specificDay) })
    });

    if (!response.ok) {
      alert('Hubo un problema al generar el itinerario. Revisa la consola para más detalles.');
      return;
    }

    const data = await response.json();
    setItinerary(data);
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Generador de Itinerario de Viaje</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Destino:
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
            placeholder="Ej: Rome"
          />
        </label>

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Día específico:
          <input
            type="number"
            value={specificDay}
            onChange={(e) => setSpecificDay(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
            placeholder="Ej: 1"
          />
        </label>
      </div>

      <button
        onClick={handleClick}
        style={{ 
          background: '#1E40AF', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem', 
          cursor: 'pointer' 
        }}
      >
        Generar itinerario
      </button>

      {itinerary && <Itinerary itinerary={itinerary} />}
    </div>
  );
}
