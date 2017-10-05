// const router = require('express').Router();
const unirest = require('unirest');
const topAirports = require('../../data/topAirports.json');

/*Use Amadeus API to fetch flight ticket prices
e.g) origin=BOS&departure_date=2015-09-06--2015-09-26&duration=7--9&max_price=500

expected Output: 

{ origin: 'BOS',
  currency: 'USD',
  results:
   [ { destination: 'CLE',
       departure_date: '2017-10-20',
       return_date: '2017-10-21',
       price: '110.19',
       airline: 'NK' },
     { destination: 'CHI',
       departure_date: '2017-10-20',
       return_date: '2017-11-04',
       price: '119.40',
       airline: 'UA' }
  ]
}
*/

const getFlightPrices = (origin, departureDate, maxPrice, apiKey="pryQGXaCG5zkd5P3yAGEQbWX9uMawvpT") => {
  return new Promise((resolve, reject) => {
    unirest.get(`http://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=${origin}&departure_date=${departureDate}&max_price=${maxPrice}&apikey=${apiKey}`)
      .header("Accept", "application/json") 
      .end(result => {
        if (result.status === 200) resolve(result.body);
        else reject(`Failed to fetch flight prices from: ${origin}`);
      });
  });
};

//Fetches flights with destinations that are in the top 100 airport list
getFlightPrices(origin="BOS", departureDate="2017-10-20", maxPrice="1000")
  .then(bigObject => {
    return bigObject.results
  })
  .then(airports => airports.filter(airport => {
    return topAirports.find( searchAirport => {
      return searchAirport.iata_faa === airport.destination;
    }) !== undefined;
  }))
  .then(topDestinations => {
    return topDestinations;
  })
  .catch(console.error);