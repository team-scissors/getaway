/* eslint new-cap:0 */
const router = require('express').Router();
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

// Create a new trip
router.post('/', (req, res, next) => {
  const body = req.body;
  Trip.create(body)
  .then()
});
