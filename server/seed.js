const airports = require('../data/nonDuplicate_airports.json');
const db = require('./db');
const { Airport } = require('./db/models');
const Promise = require('bluebird');

//iata_faa is the abbrv
//airport = {"airport_id":"1","name":"Goroka","city":"Goroka","country":"Papua New Guinea","iata_faa":"GKA","iaco":"AYGA","latitude":"-6.081689","longitude":"145.391881","altitude":"5282","zone":"10","dst":"U"}
//dataBase columns: name, abbrv, longitude, latitude, 

/* ---------- Set up airports data ---------- */

const createAirports = ((airports) => (
  Promise.all(airports.map(airport => (
      Airport.create({
        name: airport.name,
        abbrv: airport.iata_faa,
        longitude: airport.longitude,
        latitude: airport.latitude,
      })
  )))
));


/* ---------- Syncing database ---------- */
const seed = () => createAirports(airports);

db.sync({ force: true})
  .then(() => {
    console.log('Seeding database');
    return seed();
  })
  .then(() => {
    console.log("DB", db);
    console.log('Seeding successful!');
  })
  .catch((err) => {
    console.log('Error from seeding: ', err);
  })
  .then(() => {
    db.close();
    return null;
});

