const User = require('./user');
const Airport = require('./airport');
const Trip = require('./trip');
const Flight = require('./flight');

// Each user can have many trips, and each trip must be associated with a user.
// Each trip is connected to a variety of airports as 'arrivals'.
// Use getAirports() and addAirport() to access these from a trip.
User.hasMany(Trip);

// Each trip is has a collection of flightPrices.
Trip.belongsTo(User);
Trip.belongsToMany(Flight, {
  through: 'tripFlights',
  // foreignKey: 'tripId',
});
Flight.belongsToMany(Trip, {
  through: 'tripFlights',
});

// Flight stores the price between two airports, from and to.
// Note that the price from one airport to another varies depending on the
// departure date (its more expensive to fly from CHI to LON tomorrow morning
// than three months from now). Also, the flight price can change over time.
// Refer to the created_at column to see historical data.
Airport.belongsToMany(Airport, {
  as: 'fromAirport',
  through: 'Flight',
  foreignKey: 'toId',
});
Airport.belongsToMany(Airport, {
  as: 'toAirport',
  through: 'Flight',
  foreignKey: 'fromId',
});
// Flight.belongsTo(Airport, { as: 'from' });
// Flight.belongsTo(Airport, { as: 'to' });

module.exports = {
  User,
  Airport,
  Trip,
  Flight,
};
