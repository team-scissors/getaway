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
}
type Query {
  airportById(id: Int!): Airport
  airportByAbbrv(abbrv: String!): Airport
  airports: [Airport]
}
`;

module.exports = typeDefs;
