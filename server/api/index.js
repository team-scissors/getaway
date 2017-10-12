const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/flights', require('./flights'));
router.use('/airports', require('./airports'));
router.use('/geo', require('./geo'));
router.use('/trips', require('./trips'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
