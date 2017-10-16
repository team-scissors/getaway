const { Airport } = require('../db/models');

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
  },
};

module.exports = resolvers;
