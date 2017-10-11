const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/getaway', {
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 990000,
      acquire: 0,
    }
  }
)
module.exports = db;

//COMMENTS
