const {
  Airport,
  Flight,
  User,
  Trip,
} = require('../db/models');

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
    userById(root, {id}) {
      return User.findById(id);
    },
    userByEmail(root, {email}) {
      return User.find({
        where: {
          email,
        }
      });
    }
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
    price(flight) {
      console.log('flight.departAt:', flight.departAt);
      return Airport.findById(flight.fromId)
        .then(airport => {
          
        })
    }
  },
  User: {
    tripsByUserId(user) {
      return Trip.findAll({
        where: {
          userId: user.id,
        }
      });
    }
  },
  Trip: {
    flights(trip) {
      return trip.getFlights();
    }
  }
};

module.exports = resolvers;
