const router = require('express').Router();
const unirest = require('unirest');


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

const getFlightPrices = (origin, departureDate, maxPrice) => {
  return new Promise((resolve, reject) => {
    unirest.get(`http://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=${origin}&departure_date=${departureDate}&max_price=${maxPrice}&apikey=pryQGXaCG5zkd5P3yAGEQbWX9uMawvpT`)
      .header("Accept", "application/json") 
      .end(result => {
        if (result.status) resolve(result.body);
        else reject(`Failed to fetch flight prices from: ${origin}`);
      });
  });
};

getFlightPrices(origin="BOS", departureDate="2017-10-20", maxPrice="1000")
  .then(data => console.log(data))
  .catch(console.error)





