const typeDefs = `
type Airport {
  id: Int!
  name: String!
  abbrv: String!
  city: String!
  country: String!
  continent: String!
  averageTemperature: String!
  longitude: Float!
  latitude: Float!
  flightsByFromId: [Flight]
  flightsByToId: [Flight]
}
type Flight {
  id: Int!
  price: Float!
  departAt: String! # Maybe make Date a custom scalar type
  toId: Int
  fromId: Int
  airportByToId: Airport!
  airportByFromId: Airport!
}
type AmadeusAirport {
  id: Int
  name: String
  abbrv: String
  city: String
  country: String
  continent: String
  longitude: Float
  latitude: Float
}
type AmadeusDestination {
  airport: AmadeusAirport
  bearing: Float
  distance: Float
  price: Float
  priceEfficiency: Float
}
type AmadeusFlight {
  origin: AmadeusAirport
  date: String
  destinations: [AmadeusDestination]
}
type User {
  id: Int!
  email: String!
  tripsByUserId: [Trip]
}
type Trip {
  id: Int!
  flights: [Flight]
}
type Query {
  airportById(id: Int!): Airport
  airportByAbbrv(abbrv: String!): Airport
  airports: [Airport]
  userById(id: Int!): User
  userByEmail(email: String!): User
  amadeusFlight(date: String!, originAbbrv: String!): AmadeusFlight
}
`;

module.exports = typeDefs;
