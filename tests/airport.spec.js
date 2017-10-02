/* global describe beforeEach it */

const { expect } = require('chai');
const db = require('../server/db/index');

const Airport = db.model('airport');

describe('Airport model', () => {
  beforeEach(() => db.sync({ force: true }));

  describe('model definition', () => {
    let testAirport;

    beforeEach(() =>
      Airport.create({
        name: 'testPort',
        city: 'Chicago',
        abbrv: 'TPT',
        country: 'USA',
        longitude: 1.11,
        latitude: 2.22 
      })
        .then((airport) => {
          testAirport = airport;
        }),
    );

    it('includes a correct city', () => {
      expect(testAirport.city).to.be.equal('Chicago');
    });

    it('includes a correct latitude', () => {
      expect(testAirport.latitude).to.be.equal(2.22);
    });

    it('requires a abbrv', () => {
      testAirport.abbrv = null;

      return testAirport.validate()
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