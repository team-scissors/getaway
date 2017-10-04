// Given an airport object returned from GraphQL, return a GeoJson object.
export const airportToGeoJson = airport => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [airport.longitude, airport.latitude],
    },
    properties: {
      id: airport.id,
      name: airport.name,
      abbrv: airport.abbrv,
      city: airport.city,
      country: airport.country,
    }
  };
};

// Given a flightprice between two airports returned from GraphQL,
// return a GeoJson object.
export const flightPriceToGeoJson = flightPrice => {

};

// export const flightPriceToGeoJson = flightPrice => {};
