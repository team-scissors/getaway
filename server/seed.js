const moment = require('moment');
const airports = require('../data/airportsFilteredByContinent');
const db = require('./db');
const { User, Airport, Trip, Flight } = require('./db/models');
const topAirports = require('../data/topAirports.json');
const geolib = require('geolib');
const util = require('util');
const Promise = require('bluebird');
const Chance = require('chance');
const chance = new Chance(1234);

//iata_faa is the abbrv
//airport = {"airport_id":"1","name":"Goroka","city":"Goroka","country":"Papua New Guinea","iata_faa":"GKA","iaco":"AYGA","latitude":"-6.081689","longitude":"145.391881","altitude":"5282","zone":"10","dst":"U"}
//dataBase columns: name, abbrv, longitude, latitude,

const pricePerKm = 0.18;

// Initialize an array of 14 dates.
const numDates = 14;
let dates = [];
for (let i=0; i<numDates; i++) {
  dates.push(new Date(2018, 1, i+1));
}

let idx = 0;
const getNextDate = () => {
  const date = dates[idx];
  idx = idx === dates.length-1 ? 0 : idx+1;
  return date;
};

const generateNoise = distance => {
  return distance / chance.random() / (1000 * 100);
};

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
        continent: airport.continent,
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
    userId: 1,
  },
  {
    name: 'looking for a nice getaway',
    userId: 2,
  },
  {
    name: 'where even is papau new guinea?!1?',
    userId: 3,
  },
];

const createTrips = trips => Promise.all(trips.map(trip => Trip.create(trip)));

/* ---------- Syncing database ---------- */
const seed = () => {
  return Promise.all([
    createAirports(airports),
    createUsers(fakeUsers),
  ]).spread((airports, users) => {
    console.log(` -> seeded airports & users`);
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
        topCreatedAirports
        // for each major airport, add flights to each every other major airport
        // but exclude those that are too close to it. If too close, this will
        // map to undefined
        .map(toAirport => {
          const distance = geolib.getDistance(
            {
              latitude: fromAirport.latitude,
              longitude: fromAirport.longitude,
            },
            {
              latitude: toAirport.latitude,
              longitude: toAirport.longitude,
            }
          );
          const minDist = 241.402 * 1000; // Minimum distance for a flight to exist
          if (distance < minDist) return;
          return fromAirport.addToAirport(toAirport, {
            through: {
              price: (distance / 1000 * pricePerKm) + generateNoise(distance),
              departAt: getNextDate(),
            },
          });
        })
        // filter out those that are undefined
        .filter(i => i)
      );
    });
    return Promise.all(createPrices);
  })
  .then( prices => {
    // console.log(util.inspect(prices, {
    //   depth: 3,
    //   showHidden: true,
    //   colors: true,
    //   maxArrayLength: 10,
    // }));
    return Promise.resolve();
  })
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
