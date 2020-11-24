const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../graphql/schema');

const createApolloMiddleware = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  return server;
};

module.exports = { createApolloMiddleware };
