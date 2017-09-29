/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');

const FlightPrice = db.define('flightPrice', {
  departAt: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  }
});

module.exports = FlightPrice;
