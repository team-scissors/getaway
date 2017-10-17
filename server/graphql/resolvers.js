const axios = require('axios');
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
    },
    amadeusFlight(root, {date, originAbbrv}) {
      return axios.get(`http://localhost:8080/api/flights/${originAbbrv}/${date}`)
        .then(res => res.data);
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
