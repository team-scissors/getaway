const User = require('./user');
const Airport = require('./airport');
const Trip = require('./trip');
const FlightPrice = require('./flight-price');

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

User.hasMany(Trip);
Trip.belongsTo(User);

FlightPrice.belongsTo(Airport, {as: 'from'});
FlightPrice.belongsTo(Airport, {as: 'to'});

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Airport,
  Trip,
  FlightPrice,
};
