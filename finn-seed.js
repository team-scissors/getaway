const {
  User,
  Airport,
  Trip,
  flightPrice,
} = require('./server/db/models');

const db = require('./server/db');
const dbSync = db.sync({force: true});

const fakeUsers = [
  {
    email: 'admin@admin.admin',
    password: 'admin',
  },
  {
    email: 'a@b.c',
    password: 'abc',
  },
  {
    email: 'joonkim@timsucks.com',
    password: 'lolol',
  },
];
