const Sequelize = require('sequelize');
const db = require('../db');

const Trip = db.define('trip', {
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
    type: Sequelize.FLOAT,
    allowNull: false
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
});

module.exports = Airport;
