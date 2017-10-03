const User = require('./user');
const Airport = require('./airport');
const Trip = require('./trip');
const FlightPrice = require('./flight-price');

// Each user can have many trips, and each trip must be associated with a user.
// Each trip is connected to a variety of airports as 'arrivals'.
// Use getAirports() and addAirport() to access these from a trip.
User.hasMany(Trip);
Trip.belongsTo(User);
Trip.belongsToMany(Airport, {through: 'tripArrivals'});

// Each trip has one departing airport and many possible arrival airports.
// The possible destinations are stored in the airports column as an array.
Trip.belongsTo(Airport, {foreignKey: 'departFrom'});

// FlightPrice stores the price between two airports, from and to.
// Note that the price from one airport to another varies depending on the
// departure date (its more expensive to fly from CHI to LON tomorrow morning
// than three months from now). Also, the flight price can change over time.
// Refer to the created_at column to see historical data.
FlightPrice.belongsTo(Airport, {as: 'from'});
FlightPrice.belongsTo(Airport, {as: 'to'});

module.exports = {
  User,
  Airport,
  Trip,
  FlightPrice,
};
