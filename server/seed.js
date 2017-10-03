const moment = require('moment');
const airports = require('../data/nonDuplicate_airports.json');
const db = require('./db');
const {
  User,
  Airport,
  Trip,
  FlightPrice,
} = require('./db/models');
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
        city: airport.city,
        country: airport.country,
        longitude: airport.longitude,
        latitude: airport.latitude,
      })
  )))
));

/* ---------- Set up users ---------- */

const fakeUsers = [
  {
    email: 'admin@admin.admin',
    firstName: 'Admin',
    lastName: 'McAdminFace',
    password: 'admin',
  },
  {
    email: 'a@b.c',
    firstName: 'AB',
    lastName: 'CDEFG',
    password: 'abc',
  },
  {
    email: 'joonkim@timsucks.com',
    firstName: 'Joon',
    lastName: 'Kim',
    password: 'lolol',
  },
];

const createUsers = (users => (
  Promise.all(users.map(user => (
    User.create(user)
  )))
));

/* ---------- Set up trips ---------- */

const fakeTrips = [
  {
    name: 'aaah! i need to run from the law!',
    departFrom: 5275,
    departAt: moment().add(1, 'days').format(),
    userId: 1,
  },
  {
    name: 'looking for a nice getaway',
    departFrom: 45,
    departAt: moment().add(21, 'days').format(),
    userId: 2,
  },
  {
    name: 'where even is papau new guinea?!1?',
    departFrom: 51,
    departAt: moment().add(3, 'months').format(),
    userId: 3,
  },
];

const createTrips = (trips => (
  Promise.all(trips.map(trip => (
    Trip.create(trip)
  )))
));

/* ---------- Set up flight-prices ---------- */

const fakeFlightPrices = [
  {
    departAt: moment().add(2, 'months').format(),
    fromId: 2585,
    toId: 1,
    price: 1860,
  },
  {
    departAt: moment().add(4, 'months').format(),
    fromId: 51,
    toId: 3,
    price: 810,
  },
  {
    departAt: moment().add(6, 'days').format(),
    fromId: 45,
    toId: 220,
    price: 1048,
  },
];

const createFlightPrices = (fakeFlightPrices => (
  Promise.all(fakeFlightPrices.map(flightPrice => (
    FlightPrice.create(flightPrice)
  )))
));

/* ---------- Syncing database ---------- */
const seed = () => {
  return Promise.all([
    createAirports(airports),
    createUsers(fakeUsers),
    createFlightPrices(fakeFlightPrices),
  ])
  .then( () => {
    return createTrips(fakeTrips);
  })
  .then( trips => {
    const airportsToAdd = [1, 220, 3];
    let airportIdx = -1;
    return Promise.all( [trips, ...trips.map(trip => {
      airportIdx++;
      return trip.addAirport(airportsToAdd[airportIdx]);
    })]);
  });
};

db.sync({ force: true})
  .then(() => {
    console.log('Seeding database');
    return seed();
  })
  .then(() => {
    console.log('Seeding successful!');
  })
  .catch((err) => {
    console.log('Error from seeding: ', err);
  })
  .then(() => {
    db.close();
    return null;
});
