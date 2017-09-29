const Sequelize = require('sequelize');
const db = require('../db');

const Airport = db.define('airport', {
  name: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  },
  abbrv: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
});

module.exports = Airport;
