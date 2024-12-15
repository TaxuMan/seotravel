import { useState } from 'react';
import Itinerary from '../components/Itinerary';

export default function Home() {
  const [itinerary, setItinerary] = useState(null);

  async function handleClick() {
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: 'Rome', specificDay: 1 })
    });
    const data = await response.json();
    setItinerary(data);
  }

  return (
    <div style={{ padding: '1rem' }}>
      <button 
        onClick={handleClick} 
        style={{ background: '#1E40AF', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}
      >
        Generar itinerario
      </button>
      
      {itinerary && <Itinerary itinerary={itinerary} />}
    </div>
  );
}
