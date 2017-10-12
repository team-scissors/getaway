const router = require('express').Router();
const { Airport, Flight } = require('../db/models');
module.exports = router;

router.get('/tin', (req, res, next) => {
  if (req.query.departureDate && req.query.maxPrice) {
    const origin = req.query.origin.toUpperCase();
    Airport.findOne({
      where: {
        abbrv: origin,
      },
    }).then(originAirport => {
      console.log('airport:', originAirport);
      Flight.findAll({
        where: {
          departAt: req.query.departureDate,
          fromId: originAirport.id,
          price: {
            lte: req.query.maxPrice,
          },
        },
      })
        .then(flights => res.json(flights))
        .catch(next);
    });
  }
});
