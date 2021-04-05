const { ApolloServer } = require('apollo-server-express');
const responseCachePlugin = require('apollo-server-plugin-response-cache');
const schema = require('../graphql/schema');

const createApolloMiddleware = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [responseCachePlugin()],
    cacheControl: {
      defaultMaxAge: 3600, // 1 hour
    },
  });
  return server;
};

module.exports = { createApolloMiddleware };
