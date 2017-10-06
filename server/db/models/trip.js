/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');

const Trip = db.define('trip', {
  name: {
    type: Sequelize.STRING,
  },
});

module.exports = Trip;
