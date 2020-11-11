const redisClient = require('./RedisClient');
const RealmClient = require('./RealmClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  RealmClient
};
