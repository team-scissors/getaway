const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { Airport } = require('../db/models');

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
