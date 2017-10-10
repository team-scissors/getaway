/* eslint new-cap:0 no-shadow:0 */
const router = require('express').Router();
const Promise = require('bluebird');
const {
  Trip,
  Flight,
  Airport,
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

// get trips by userId
router.get('/user/:userId/extended', async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      include: [Flight],
      where: {
        userId: req.params.userId
      }
    });
    const extendedTrips = trips.map(trip => {
      // Map each of the flights to the current trip TODO
    });
  } catch(err) {
    next(err);
  }

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
      Promise.all( flights.map(flight => {
        trip.addFlight(flight);
      }));
    })
    .then( trip => {
      res.send(trip);
    })
    .catch(next);
  } else {
    console.log('BACKEND req.body', req.body);
    res.send(400);
  }
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
/* req.body should look like
{
  "name": "some name",
  "userId": 1
}
*/
router.post('/', (req, res, next) => {
  const body = req.body;
  console.log('body:');
  console.log(body);
  Trip.create(body)
  .then(newTrip => res.send(newTrip))
  .catch(next);
});
