const { ApolloServer } = require('apollo-server-express');
const schema = require('../graphql/schema');

const createApolloMiddleware = async () => {
  const server = new ApolloServer({ schema });
  return server;
};

module.exports = { createApolloMiddleware };
