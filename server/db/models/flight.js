/* eslint new-cap:0 */
const Sequelize = require('sequelize');
const db = require('../db');

const Flight = db.define('Flight', {
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
}, {
  uniqueKeys: {
    departFromTo: {
      fields: ['departAt', 'fromId', 'toId']
    }
  }
});

module.exports = Flight;
