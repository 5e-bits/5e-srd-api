const { readFileSync } = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./resolvers/rootResolvers');

const typeDefs = readFileSync(path.resolve(__dirname, 'typeDefs.graphql'), 'UTF-8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
