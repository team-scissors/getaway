import geolib from 'geolib';

export const cardinals = {
      0: 'E',
      30: 'ESE',
      60: 'SSE',
      90: 'S',
      120: 'SSW',
      150: 'WSW',
      180: 'W',
      210: 'WNW',
      240: 'NNW',
      270: 'N',
      300: 'NNE',
      330: 'ENE',
};

export const getAirportsData = (currentAirport, airports) => {
  return airports.map(airport => {
      const destinationAirport = {
        latitude: airport.latitude,
        longitude: airport.longitude,
      };
    return {
      price: 250,
      bearing: geolib.getBearing(currentAirport, destinationAirport),
    };
    });
};
