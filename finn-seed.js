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
    firstName: 'Admin',
    lastName: 'McAdminFace',
    password: 'admin',
  },
  {
    email: 'a@b.c',
    firstName: 'AB',
    lastName: 'CDEFG',
    password: 'abc',
  },
  {
    email: 'joonkim@timsucks.com',
    firstName: 'Joon',
    lastName: 'Kim',
    password: 'lolol',
  },
];

dbSync
.then( () => {
  // console.log('db');
  // console.log(db);
  const createUsers = fakeUsers.map(user => {
    console.log('user: ', user);
    return User.create(user);
  });
  // return User.create({
  //   email: 'admin@admin.com',
  //   password: 'admin',
  // });
  return Promise.all(createUsers);
})
.then(() => {
  db.close();
  return null;
})
// .catch(console.error);
