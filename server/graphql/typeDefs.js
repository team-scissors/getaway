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
  flightsByFromAirport: [Flight]
}
type Flight {
  id: Int!
  price: Float!
  toId: Airport
  fromId: Airport
}
type Query {
  airportById(id: Int!): Airport
  airportByAbbrv(abbrv: String!): Airport
  airports: [Airport]
  # flightById(id: Int!): Flight
  # flightWithAirports(id: Int!): Flight
}
`;

module.exports = typeDefs;
