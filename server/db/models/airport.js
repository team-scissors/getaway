const Sequelize = require('sequelize');
const db = require('../db');

const Airport = db.define('airport', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  abbrv: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  longitude: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  latitude: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

})

module.exports = Airport;
