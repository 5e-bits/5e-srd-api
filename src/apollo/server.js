const { ApolloServer } = require('apollo-server-express');
const app = require('../server');
const createGateway = require('./gateway');

const createApolloMiddleware = async () => {
  const gateway = await createGateway();
  const serverConfig = {
    gateway
  };
  const server = new ApolloServer(serverConfig);
  server.applyMiddleware({ app });
  return server;
};

module.exports = createApolloMiddleware;
