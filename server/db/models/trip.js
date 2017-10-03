/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');
const Airport = require('./airport');

const Trip = db.define('trip', {
  name: {
    type: Sequelize.STRING,
  },
  // airports: {
  //   type: Sequelize.ARRAY(Sequelize.INTEGER), // An array of foreign keys of airports
  //   allowNull: false,
  //   // get() {
  //   //   const airportIds = this.getDataValue('airports');
  //   //   const findAirports = airportIds.map( id => Airport.findById(id));
  //   //   console.log('inside the get airports virtual method');
  //   //   return Promise.all(findAirports); // TODO: Confirm this actually works.
  //   //                                     // Can we return a promise like this?
  //   // }
  //   // UPDATE: It doesn't work. :_(
  // },
  departAt: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
});

Trip.prototype.getAirports = function() {
  return Airport.findAll({where: {id: this.airports}});
};

module.exports = Trip;
