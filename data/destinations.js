export const predefinedDestinations = {
  'roma': {
    destination: {
      name: "Roma",
      weather: "Clima mediterráneo continental",
      bestTimeToVisit: "Primavera (Abril-Mayo) u Otoño (Septiembre-Octubre)"
    },
    days: [
      {
        day: 1,
        activities: [
          {
            time: "09:00",
            name: "Visita al Coliseo",
            description: "Explora el anfiteatro más famoso del mundo",
            duration: "2 horas",
            cost: "16€",
            tips: "Compra los tickets online para evitar colas"
          },
          {
            time: "12:00",
            name: "Foro Romano",
            description: "Centro de la antigua Roma",
            duration: "2 horas",
            cost: "Incluido con entrada del Coliseo",
            tips: "Lleva agua y gorra en verano"
          }
        ]
      },
      // Más días...
    ]
  },
  'paris': {
    // Estructura similar para París
  }
};
