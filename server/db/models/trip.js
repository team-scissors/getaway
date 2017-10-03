/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');
const Airport = require('./airport');
const FlightPrice = require('./flight-price');

const Trip = db.define('trip', {
  name: {
    type: Sequelize.STRING,
  },
  departAt: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
});

Trip.prototype.getFlightPrices = function() {
  console.log('this.departFrom:');
  console.log(this.departFrom);
  return this.getAirports().map( airport => {
    return FlightPrice.findAll({
      // include: [Airport],
      where: {
        fromId: this.departFrom,
    }});
  });
};

module.exports = Trip;
