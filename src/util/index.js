const redisClient = require('./RedisClient');
const apolloClient = require('./ApolloClient');
const RealmClient = require('./RealmClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  apolloClient,
  RealmClient
};
