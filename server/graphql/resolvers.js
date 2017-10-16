const { Airport, Flight } = require('../db/models');

const resolvers = {
  Query: {
    airports() {
      return Airport.findAll();
    },
    airportById(root, {id}) {
      return Airport.findById(id);
    },
  },
  Airport: {
    flightsByFromId(airport) {
      return Flight.findAll({
        where: {
          fromId: airport.id,
        }
      });
    },
    flightsByToId(airport) {
      return Flight.findAll({
        where: {
          toId: airport.id,
        }
      });
    },
  },
  Flight: {
    airportByFromId(flight) {
      return Airport.findById(flight.fromId);
    },
    airportByToId(flight) {
      return Airport.findById(flight.toId);
    },
  },
};

module.exports = resolvers;
