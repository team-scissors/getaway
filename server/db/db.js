const Sequelize = require('sequelize')
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/getaway', {
    logging: false,
    dialetOptions: {
      timeout:60,
    }
  }
)
module.exports = db
