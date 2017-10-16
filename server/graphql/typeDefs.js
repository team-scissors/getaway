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
  toId: Int
  fromId: Int
  airportByToId: Airport!
  airportByFromId: Airport!
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
}
`;

module.exports = typeDefs;
