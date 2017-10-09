/* eslint new-cap:0 no-shadow:0 */
const router = require('express').Router();
const Promise = require('bluebird');
const {
  Trip,
  Flight,
} = require('../db/models');
module.exports = router;

// get all trips
router.get('/', (req, res, next) => {
  Trip.findAll()
  .then(trips => res.send(trips))
  .catch(next);
});

// get trips by userId
router.get('/user/:userId', (req, res, next) => {
  Trip.findAll({
    include: [Flight],
    where: {
      userId: req.params.userId
    }
  })
  .then(trips => res.send(trips))
  .catch(next);
});

// get a trip by its id
router.get('/:tripId', (req, res, next) => {
  Trip.findById(req.params.tripId, {
    include: [Flight]
  })
  .then(trip => res.send(trip))
  .catch(next);
});

// get a trip's flights
router.get('/:tripId/flights', (req, res, next) => {
  Trip.findById(req.params.tripId, {
    include: [Flight]
  })
  .then(trip => res.send(trip.Flights))
  .catch(next);
});

// Adds a flight to an existing trip
router.put('/:tripId/:flightId', (req, res, next) => {
  const trip = Trip.findById(req.params.tripId);
  const flight = Flight.findById(req.params.flightId);
  Promise.all([trip, flight])
  .spread( (trip, flight) => {
    trip.addFlight(flight);
  })
  .then(trip => res.send(trip))
  .catch(next);
});

// Adds a bunch of flights to a trip. The body of the request should look like
/*
[ 7893, 123, 5431 ] <-- where each number is an id of a flight
*/
router.post('/:tripId', (req, res, next) => {
  const flightIds = req.body;
  console.log('flightIds');
  console.log(flightIds);
  if (req.body && Array.isArray(flightIds)) {
    const flights = Promise.all( flightIds.map(id => {
      return Flight.findById(id);
    }));
    const trip = Trip.findById(req.params.tripId);
    Promise.all([flights, trip])
    .spread( (flights, trip) => {
      // REVIEW: This does not return promise, is that what we want?
      Promise.all( flights.map(flight => {
        trip.addFlight(flight);
      }));
    })
    .then( trip => {
      res.send(trip);
    })
    .catch(next);
  } else {
    res.send(400);
  }
});

// Removes a flight from a trip
// REVIEW: opportunity to use async/await
router.delete('/:tripId/:flightId', async (req, res, next) => {
  try {
    const tripQuery = Trip.findById(req.params.tripId);
    const flightQuery = Flight.findById(req.params.flightId);
    const trip = await tripQuery;
    const flight = await flightQuery;
    await trip.removeFlight(flight);
    res.send(trip);
  }
  catch (error) {
    next(error);
  }
});

// Delete a trip
// REVIEW: here too!
router.delete('/:tripId', async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
    await trip.destroy();
    res.send(200);
  }
  catch (error) {
    next(error);
  }
});

// Create a new trip.
// REVIEW: so easy!
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newTrip = await Trip.create(body);
    res.send(newTrip);
  }
  catch(error) {
    next(error):
  }
});
