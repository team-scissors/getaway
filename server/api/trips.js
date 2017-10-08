/* eslint new-cap:0 no-shadow:0 */
const router = require('express').Router();
const Promise = require('bluebird');
const {
  Trip,
  Flight,
  User,
} = require('../db/models');
module.exports = router;

// get trips by userId
router.get('/:userId', (req, res, next) => {
  Trip.findAll({
    include: [Flight],
    where: {
      userId: req.params.userId
    }
  })
  .then(trips => res.send(trips))
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

// Create a new trip
router.post('/', (req, res, next) => {
  const body = req.body;
  Trip.create(body)
  .then(newTrip => res.send(newTrip))
  .catch(next);
});
