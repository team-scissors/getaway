const router = require('express').Router();
const unirest = require('unirest');


const getFlightPrices = (origin, departureDate, maxPrice) => {
  return new Promise((resolve, reject) => {
    unirest.get(`http://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=${origin}&departure_date=${departureDate}&max_price=${maxPrice}`)
      .header("X-Mashape-Key", "pryQGXaCG5zkd5P3yAGEQbWX9uMawvpT")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) resolve(result.body.ten_degree);
        else reject(`Failed to fetch flight prices from: ${origin}`);
      });
  });
};