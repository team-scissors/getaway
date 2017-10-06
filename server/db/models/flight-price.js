/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');

const FlightPrice = db.define('FlightPrice', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departAt: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

module.exports = FlightPrice;
