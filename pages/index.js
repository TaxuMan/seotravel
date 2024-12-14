import React, { useState } from 'react';

const TRAVEL_TYPES = [
  { id: 'cultural', label: 'Cultural (Monumentos, Museos)' },
  { id: 'gastronomico', label: 'Gastronómico' },
  { id: 'relax', label: 'Relax' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'naturaleza', label: 'Naturaleza' }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    selectedTravelTypes: [],
    budget: '',
    withKids: false,
    accommodation: {
      type: 'hotel',
      location: '',
      address: ''
    },
    transportType: 'transporte-publico'
  });

  const handleTravelTypeToggle = (typeId) => {
    setFormData(prev => ({
      ...prev,
      selectedTravelTypes: prev.selectedTravelTypes.includes(typeId)
        ? prev.selectedTravelTypes.filter(id => id !== typeId)
        : [...prev.selectedTravelTypes, typeId]
    }));
  };

  const handleAccommodationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      accommodation: {
        ...prev.accommodation,
        [field]: value
      }
    }));
  };

const handleSubmit = async () => {
   if (!formData.destination) {
    alert('Por favor, ingresa un destino');
    return;
  }
  setIsLoading(true);
  
  try {
    console.log('Enviando datos:', formData); // Para ver qué datos enviamos

    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('Respuesta recibida:', data); // Para ver qué datos recibimos
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al generar el itinerario');
    }

    setItinerary(data);
    console.log('Itinerario establecido:', data); // Para verificar el estado
  } catch (error) {
    console.error('Error detallado:', error);
    alert(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Plan tu Viaje con IA</h1>
        
        <div className="grid gap-6 mb-6">
          {/* Información básica */}
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Información Básica</h2>
            
            <div>
              <label className="block mb-2 font-medium">Destino</label>
              <input
                type="text"
                placeholder="Ej: Barcelona"
                className="w-full p-2 border rounded"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Días de viaje</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={formData.days}
                onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          </div>

          {/* Alojamiento */}
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Alojamiento</h2>
            
            <div>
              <label className="block mb-2 font-medium">Tipo de alojamiento</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.accommodation.type}
                onChange={(e) => handleAccommodationChange('type', e.target.value)}
              >
                <option value="hotel">Hotel</option>
                <option value="apartamento">Apartamento</option>
                <option value="hostal">Hostal</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Zona de alojamiento</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.accommodation.location}
                onChange={(e) => handleAccommodationChange('location', e.target.value)}
              >
                <option value="">Selecciona zona</option>
                <option value="centro">Centro ciudad</option>
                <option value="playa">Zona playa</option>
                <option value="afueras">Afueras</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Dirección específica (opcional)</label>
              <input
                type="text"
                placeholder="Ej: Calle Example 123"
                className="w-full p-2 border rounded"
                value={formData.accommodation.address}
                onChange={(e) => handleAccommodationChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Tipo de viaje */}
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Tipo de viaje (selecciona uno o varios)</h2>
            <div className="grid grid-cols-2 gap-2">
              {TRAVEL_TYPES.map(type => (
                <label key={type.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.selectedTravelTypes.includes(type.id)}
                    onChange={() => handleTravelTypeToggle(type.id)}
                    className="form-checkbox"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transporte */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Medio de transporte preferido</h2>
            <select
              className="w-full p-2 border rounded"
              value={formData.transportType}
              onChange={(e) => setFormData({...formData, transportType: e.target.value})}
            >
              <option value="a-pie">A pie</option>
              <option value="transporte-publico">Transporte público</option>
              <option value="transporte-privado">Transporte privado</option>
            </select>
          </div>

          {/* Otras opciones */}
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Otras opciones</h2>
            
            <div>
              <label className="block mb-2 font-medium">Presupuesto</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              >
                <option value="">Selecciona presupuesto</option>
                <option value="economico">Económico</option>
                <option value="moderado">Moderado</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.withKids}
                onChange={(e) => setFormData({...formData, withKids: e.target.checked})}
              />
              <label>Viajo con niños</label>
            </div>
          </div>
        </div>
        
        <button
          className="w-full bg-blue-500 text-white p-3 rounded font-medium hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Generando itinerario...' : 'Generar itinerario'}
        </button>
      </div>

      {/* Visualización del itinerario */}
      {itinerary && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Tu Itinerario en {itinerary.destination?.name}</h2>

          {/* Información general del destino */}
          {itinerary.destination && (
            <div className="mb-8 bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Información del Destino</h3>
              <div className="space-y-2">
                <p><strong>Mejor época para visitar:</strong> {itinerary.destination.bestTimeToVisit}</p>
                <p><strong>Clima:</strong> {itinerary.destination.weather}</p>
                {itinerary.destination.localTips && (
                  <div>
                    <p className="font-semibold">Tips locales:</p>
                    <ul className="list-disc pl-5">
                      {itinerary.destination.localTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Itinerario por días */}
          {itinerary.days && itinerary.days.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-8">
              <h3 className="text-lg font-bold mb-4">Día {day.day}</h3>
              {day.weather && (
                <p className="text-sm text-gray-600 mb-4">🌤️ {day.weather}</p>
              )}
              
              <div className="space-y-6">
                {day.activities && day.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-bold text-lg">{activity.time} - {activity.name}</div>
                    <div className="text-gray-600 mt-1">{activity.description}</div>
                    
                    {activity.location && (
                      <div className="text-sm mt-2">
                        📍 {activity.location.address}
                      </div>
                    )}

                    {activity.duration && (
                      <div className="text-sm mt-1">⏱️ Duración: {activity.duration}</div>
                    )}

                    {activity.cost && (
                      <div className="text-sm mt-1">💰 Costo: {activity.cost}</div>
                    )}

                    {activity.localTips && activity.localTips.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold text-sm">Tips locales:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {activity.localTips.map((tip, tipIndex) => (
                            <li key={tipIndex}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {day.meals && day.meals.map((meal, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="font-bold text-lg">{meal.time} - {meal.type}</div>
                    <div className="text-gray-600">{meal.venue}</div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">🍽️ Cocina: {meal.cuisine}</p>
                      <p className="text-sm">💰 Rango de precio: {meal.priceRange}</p>
                      <p className="text-sm">📍 {meal.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Información de presupuesto */}
          {itinerary.budget && (
            <div className="mt-8 bg-yellow-50 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Presupuesto Estimado</h3>
              <div className="space-y-2">
                <p><strong>Costo diario estimado:</strong> {itinerary.budget.estimated_daily_cost}</p>
                {itinerary.budget.breakdown && (
                  <div className="mt-2">
                    <p className="font-semibold">Desglose:</p>
                    <ul className="list-none pl-5">
                      <li>🏨 Alojamiento: {itinerary.budget.breakdown.accommodation}</li>
                      <li>🍽️ Comida: {itinerary.budget.breakdown.food}</li>
                      <li>🎫 Actividades: {itinerary.budget.breakdown.activities}</li>
                      <li>🚌 Transporte: {itinerary.budget.breakdown.transport}</li>
                    </ul>
                  </div>
                )}
                {itinerary.budget.money_saving_tips && (
                  <div className="mt-2">
                    <p className="font-semibold">Tips para ahorrar:</p>
                    <ul className="list-disc pl-5">
                      {itinerary.budget.money_saving_tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
