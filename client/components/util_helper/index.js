import geolib from 'geolib';

//cardinals object used in flights component to render cardinals outside the circle
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

//helper function return an array of objects that is used in flights component to render dots
export const getAirportsData = (currentAirport, airports, r) => {
  return airports.map(airport => {
      const destinationAirport = {
        latitude: airport.latitude,
        longitude: airport.longitude,
      };
    return {
      name: airport.name,
      price: r(+airport.price),
      bearing: geolib.getBearing(currentAirport, destinationAirport),
    };
    });
};

//return all prices for all airports
export const ticketPrices = airports => {
  const prices = [];
  airports.forEach(airport => {
    prices.push(+airport.price);
  });

  return prices;
};
