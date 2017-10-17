/* global describe beforeEach it */

const { expect } = require('chai');
const db = require('../../server/db/index');

const Trip = db.model('trip');
const Airport = db.model('airport');

describe('Trip model', () => {
  beforeEach(() => db.sync({ force: true }));

  describe('model definition', () => {
    let testTrip;
    let testAirport;

    beforeEach(() =>
      Trip.create({
        name: 'testPort',
        airports: [2],
        departAt: "2016-06-22T00:00:00+0800"
      })
        .then((trip) => {
          testTrip = trip;
          return Airport.create({
            id: 2,
            name: 'O-Hare',
            abbrv: 'OHA',
            city: "Chicago",
            country: "USA",
            longitude: 10,
            latitude: 10,
          })
        })
          .then((airport) => {
            testAirport = airport;
          })
    );

    it('includes a correct array of airports', () => {
      testTrip.airports
        .then(airports => {
          expect(airports[0].dataValues).to.deep.equal(testAirport.dataValues);
        })
    })

    it('requires a depart time', () => {
      testTrip.departAt = null;
      return testTrip.validate()
        .then(() => {
          throw new Error('validation should fail when abbrv is empty');
        },
        (result) => {
          expect(result).to.be.an.instanceOf(Error);
          expect(result.message).to.contain('notNull Violation');
        });
    });
  });
});
