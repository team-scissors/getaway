const { Airport, Flight } = require('../db/models');

const resolvers = {
  Query: {
    airports() {
      return Airport.findAll();
    },
    airportById(root, {id}) {
      return Airport.findById(id);
    },
    airportByAbbrv(root, {abbrv}) {
      return Airport.find({
        where: {
          abbrv,
        }
      });
    },
    flightById(root, {id}) {
      return Flight.findById(id)
        .then(flight => {
          console.log(flight);
          return flight;
        });
    },
    flightWithAirports(root, {id}) {
      return Flight.findById(id, {
        include: [
          { model: Airport, as: 'fromAirport' },
          { model: Airport, as: 'toAirport' },
        ]
      })
        .then(flight => {
          console.log(flight);
          return flight;
        });
    }
  },
};

module.exports = resolvers;
