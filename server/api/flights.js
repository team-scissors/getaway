const router = require('express').Router();
const {Flight} = require('../db/models');
module.exports = router;

router.get('/', (req, res, next) => {
  //find flights by departure date and max price
  if (req.query.departureDate && req.query.maxPrice ){
    Flight.findAll({
      where: {
        departAt: req.query.departureDate,
        price: {
          lte: req.query.maxPrice
        }
      }
    })
      .then(flights => res.json(flights))
      .catch(next);
  }
  //find flights by departure date
  else if (req.query.departureDate){
    Flight.findAll({
      where: {
        departAt: req.query.departureDate,
      }
    })
      .then(flights => res.json(flights))
      .catch(next);
  }
});

// Finds all flights by departure date. Make sure the date param
// looks something like '02-01-2018', NOT '02/01/2018' OR '2-1-18'
router.get('/:date', async (req, res, next) => {
  const date = req.params.date;
  try {
    const filteredFlights = await Flight.findAll({
      where: {
        departAt: date,
      }
    })
    res.json(filteredFlights);
  } catch(err) {
    next(err)
  }
});
