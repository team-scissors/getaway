/* global describe beforeEach it */

const { expect } = require('chai');
const db = require('../server/db/index');

const Trip = db.model('trip');

describe('Trip model', () => {
  beforeEach(() => db.sync({ force: true }));

  describe('model definition', () => {
    let testTrip;

    beforeEach(() =>
      Trip.create({
        name: 'testPort',
        airports: [2,3,4],
        departAt: "2016-06-22T00:00:00+0800"
      })
        .then((trip) => {
          testTrip = trip;
        }),
    );

    it('includes a correct array of airports', () => {
      expect(testTrip.airports).to.be.equal([2,3,4]);
    });

    it('requires a abbrv', () => {
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