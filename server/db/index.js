if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://localhost:5432/getaway';
}

const db = require('./db')

// register models
require('./models')

module.exports = db
