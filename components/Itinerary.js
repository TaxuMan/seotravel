import React from 'react';

export default function Itinerary({ itinerary }) {
  if (!itinerary) {
    return <p>Loading...</p>;
  }

  const { destination, days } = itinerary;

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{destination.name}</h2>
      <p><strong>Mejor época para visitar:</strong> {destination.bestTimeToVisit}</p>
      <p><strong>Clima:</strong> {destination.weather}</p>

      {days.map(dayData => (
        <div key={dayData.day} style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Día {dayData.day}</h3>
          {dayData.activities.map((activity, index) => (
            <div key={index} style={{ borderLeft: '4px solid #1E40AF', paddingLeft: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{activity.time} - {activity.name}</h4>
              <p style={{ margin: '0.25rem 0' }}>{activity.description}</p>
              <p style={{ margin: '0.25rem 0' }}>⏱ Duración: {activity.duration}</p>
              <p style={{ margin: '0.25rem 0' }}>💰 Costo: {activity.cost}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
