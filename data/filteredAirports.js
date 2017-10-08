const rawAirports = require('./nonDuplicate_airports.json');
const countriesByContinent = require('./countriesByContinent.json');
const countriesByYearlyAverageTemperature = require('./countriesByYearlyAverageTemperature.json');

//add continents to the airports
const airportsByContinent = rawAirports.map(rawArpt => {
  let foundCountry = countriesByContinent.find(obj => obj.country === rawArpt.country
  );

  if(foundCountry){
    return {...rawArpt, continent: foundCountry.continent}
  }

  return null;
}).filter(arpt => arpt !== null);

//add temperature to the airports
const airportsByTemperature = airportsByContinent.map(airport => {
  let foundCountry = countriesByYearlyAverageTemperature.find(obj => obj.country === airport.country);

  if(foundCountry){
    return {...airport, temperatureInFahrenheit: (Math.trunc(foundCountry.temperature * 1.8 + 32))};
  }

  return null;
}).filter(airport => airport !== null);

//console.log('airportsByTemperature ', airportsByTemperature);
module.exports = airportsByTemperature;
