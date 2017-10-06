const router = require('express').Router()
const {Airport} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  if(req.query.country){
    Airport.findAll({
      where: {
        country: req.query.country,
      }
    })
      .then(airports => res.json(airports))
      .catch(next);
  }
  else{
    Airport.findAll()
      .then(airports => res.json(airports))
      .catch(next);
  }
})
