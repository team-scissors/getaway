const router = require('express').Router()
const {Airport} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  // find airport by country
  if(req.query.country){
    Airport.findAll({
      where: {
        country: req.query.country,
      }
    })
      .then(airports => res.json(airports))
      .catch(next);
  }
  // find airports by continent
  else if(req.query.continent){
    Airport.findAll({
      where: {
        continent: req.query.continent,
      }
    })
      .then(airports => res.json(airports))
      .catch(next);
  }
  //find all airports
  else{
    Airport.findAll()
      .then(airports => res.json(airports))
      .catch(next);
  }
});
