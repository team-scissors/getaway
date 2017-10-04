/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');
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
  return FlightPrice.findAll({
    where: {
      fromId: this.departFrom,
    }
  });
};

module.exports = Trip;
