const path = require('path');
const csv = require('csvtojson');
const jsonfile = require('jsonfile');

var file = './nonDuplicate_airports.json';

const csvFilePath = path.join(__dirname, './global_airports.csv');
const allAirports = [];
csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    if (jsonObj.iata_faa && jsonObj.name) {
      allAirports.push(jsonObj);
    }
  })
  .on('done', (error) => {
    console.log('writing json');
    jsonfile.writeFile(file, allAirports, function(err) {
      console.error(err);
    });
    console.error(error);
  });
