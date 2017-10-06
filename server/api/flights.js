const router = require('express').Router()
const {Flight} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  //find flights by departure date and max price
  if(req.query.departureDate && req.query.maxPrice ){
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
  else if(req.query.departureDate){
    Flight.findAll({
      where: {
        departAt: req.query.departureDate,
      }
    })
      .then(flights => res.json(flights))
      .catch(next);
  }
})
