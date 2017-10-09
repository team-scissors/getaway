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

// Removes a flight from a trip
router.delete('/:tripId/:flightId', (req, res, next) => {
  const trip = Trip.findById(req.params.tripId);
  const flight = Flight.findById(req.params.flightId);
  Promise.all([trip, flight])
  .spread( (trip, flight) => {
    trip.removeFlight(flight);
  })
  .then(trip => res.send(trip))
  .catch(next);
});

// Delete a trip
router.delete('/:tripId', (req, res, next) => {
  Trip.findById(req.params.tripId)
  .then( trip => {
    trip.destroy();
  })
  .then( success => {
    res.send(success);
  })
  .catch(next);
});

// Create a new trip.
router.post('/', (req, res, next) => {
  const body = req.body;
  Trip.create(body)
  .then(newTrip => res.send(newTrip))
  .catch(next);
});
