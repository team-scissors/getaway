const bigList = require('./nonDuplicate_airports.json');
const smallerList = require('./topAirports.json');
const jsonfile = require('jsonfile');
var file = './filteredTopAirports_done.js';

// const resultList = bigList.filter( airport => {
//   return (
//     smallerList.find( searchAirport => {
//       return searchAirport.code === airport.iata_faa;
//     }) !== undefined
//   )
// })

const resultList = bigList.filter( airport => {
  // console.log(airport.name)
  return smallerList.find( searchAirport => {
    return searchAirport.CODE === airport.iata_faa;
  }) !== undefined;
})

console.log(resultList);

jsonfile.writeFile(file, resultList, function(err) {
  console.error(err);
});
