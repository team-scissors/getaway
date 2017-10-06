const rawAirportsByContinent = require('./rawDataAirportsByContinents.js');
const rawAirports = require('./nonDuplicate_airports.json');

const airportsByContinents = [];

rawAirportsByContinent.forEach(rawArptByCont => {
  const airport = rawAirports.find(rawArpt => {
    return (rawArpt.name && rawArptByCont.name) && (rawArpt.name.toLowerCase() === rawArptByCont.name.toLowerCase()) && (rawArpt.iata_faa === rawArptByCont.iata)
  });

  if( airport !== undefined ){
    airportsByContinents.push({...airport, continent: rawArptByCont.continent});
  }
});

module.exports = airportsByContinents;
