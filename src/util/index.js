const redisClient = require('./RedisClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient
};
