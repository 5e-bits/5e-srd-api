const redisClient = require('./RedisClient');
const apolloClient = require('./ApolloClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  apolloClient
};
