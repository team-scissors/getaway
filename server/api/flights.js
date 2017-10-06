const router = require('express').Router()
const {Flight} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  Flight.findAll()
    .then(flights => res.json(flights))
    .catch(next);
})
