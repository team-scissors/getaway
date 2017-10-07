/* eslint new-cap:0 */
const router = require('express').Router();
const {
  Trip,
  Flights,
  User,
} = require('../db/models');
module.exports = router;

// get trips by userId
router.get('/:userId', (req, res, next) => {

});

// Create a new trip
router.post('/', (req, res, next) => {

});
