const moment = require('moment');
const airports = require('../data/nonDuplicate_airports.json');
const db = require('./db');
const { User, Airport, Trip, FlightPrice } = require('./db/models');
const topAirports = require('../data/topAirports.json');
const Promise = require('bluebird');

//iata_faa is the abbrv
//airport = {"airport_id":"1","name":"Goroka","city":"Goroka","country":"Papua New Guinea","iata_faa":"GKA","iaco":"AYGA","latitude":"-6.081689","longitude":"145.391881","altitude":"5282","zone":"10","dst":"U"}
//dataBase columns: name, abbrv, longitude, latitude,

/* ---------- Set up airports data ---------- */

const createAirports = airports =>
  Promise.all(
    airports.map(airport =>
      Airport.create({
        name: airport.name,
        abbrv: airport.iata_faa,
        city: airport.city,
        country: airport.country,
        longitude: airport.longitude,
        latitude: airport.latitude,
      }),
    ),
  );

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

const createUsers = users => Promise.all(users.map(user => User.create(user)));

/* ---------- Set up trips ---------- */

const fakeTrips = [
  {
    name: 'aaah! i need to run from the law!',
    airports: [1, 200, 75],
    departFrom: 5275,
    departAt: moment()
      .add(1, 'days')
      .format(),
    userId: 1,
  },
  {
    name: 'looking for a nice getaway',
    airports: [220],
    departFrom: 45,
    departAt: moment()
      .add(21, 'days')
      .format(),
    userId: 2,
  },
  {
    name: 'where even is papau new guinea?!1?',
    airports: [1, 2, 3],
    departFrom: 51,
    departAt: moment()
      .add(3, 'months')
      .format(),
    userId: 3,
  },
];

/* ---------- Syncing database ---------- */
const seed = () => {
  return Promise.all([
    createAirports(airports),
    createUsers(fakeUsers),
  ]).spread((airports, users) => {
    const topCreatedAirports = airports.filter(airport => {
      return (
        topAirports.find(searchAirport => {
          return searchAirport.iata_faa === airport.abbrv;
        }) !== undefined
      );
    });
    // For topCreatedAirports we need to make complete bipartite graph of prices

    const createPrices = topCreatedAirports.map(fromAirport => {
      return Promise.all(
        topCreatedAirports.map(toAirport => {
          return fromAirport.addToAirport(toAirport, {
            through: {
              price: 1,
              departAt: Date.now(),
            },
          });
        }),
      );
      // topCreatedAirports.map(toAirport => {
      //   fromAirport.addTo(toAirport, { as: 'from', through: FlightPrice });
      // });
    });

    // const createPrices = Promise.map(topCreatedAirports, fromAirport => {
    //   return topCreatedAirports.map(toAirport => {
    //     fromAirport.addTo(toAirport, { as: 'from', through: FlightPrice });
    //   });
    // });

    // const createTrips = fakeTrips.map(trip => {
    //   return Trip.create(trip);
    // });

    return Promise.all(createPrices);

    // return Promise.all([createTrips, createPrices]);
    // return Promise.all([createTrips, createPrices]);
  });
};

db
  .sync({ force: true })
  .then(() => {
    console.log('Seeding database');
    return seed();
  })
  .then(() => {
    console.log('Seeding successful!');
  })
  .catch(err => {
    console.log('Error from seeding: ', err);
  })
  .then(() => {
    db.close();
    return null;
  });
