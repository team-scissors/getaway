const path = require('path');
const csv = require('csvtojson');
const jsonfile = require('jsonfile');

var file = './airports_USA.json';

const csvFilePath = path.join(__dirname, './global_airports.csv');
const allAirports = [];
csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    if (jsonObj.country === 'United States') allAirports.push(jsonObj);
  })
  .on('done', (error) => {
    console.log('writing json');
    jsonfile.writeFile(file, allAirports, function(err) {
      console.error(err);
    });
  });
