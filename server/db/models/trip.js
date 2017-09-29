/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');
const Airport = require('./airport');

const Trip = db.define('trip', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  airports: {
    type: Sequelize.ARRAY(Sequelize.INTEGER), // An array of foreign keys of airports
    allowNull: false,
    get() {
      const airportIds = this.getDataValue('airports');
      const findAirports = airportIds.map( id => Airport.findById(id));
      return Promise.all(findAirports); // TODO: Confirm this actually works.
                                        // Can we return a promise like this?
    }
  },
  departAt: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  }
});

module.exports = Trip;
