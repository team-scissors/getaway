const router = require('express').Router();
const { Airport, Flight } = require('../db/models');
// const turf = require('turf');
module.exports = router;

const constructTIN = (flights, origin) => {
  const tinLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  flights.forEach(flight => {
    tinLayer.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [origin.latitude, origin.longitude],
      },
    });
  });

  return tinLayer;
};

router.get('/tin', (req, res, next) => {
  if (req.query.departureDate && req.query.maxPrice) {
    const origin = req.query.origin.toUpperCase();
    Airport.findOne({
      where: {
        abbrv: origin,
      },
      include: [
        {
          model: Airport,
          as: 'toAirport',
        },
      ],
    }).then(originAirport => {
      res.json(originAirport);
    });
    // Airport.findOne({
    //   where: {
    //     abbrv: origin,
    //   },
    // }).then(originAirport => {
    //   console.log('airport:', originAirport);
    //   Flight.findAll({
    //     where: {
    //       departAt: req.query.departureDate,
    //       fromId: originAirport.id,
    //       price: {
    //         lte: req.query.maxPrice,
    //       },
    //     },
    //     include: [
    //       { model: Airport, as: 'toId' },
    //       { model: Airport, as: 'fromId' },
    //     ],
    //   })
    //     .then(flights => res.json(flights))
    //     .catch(next);
    // });
  }
});
