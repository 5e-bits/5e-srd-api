const RedisClient = require('./RedisClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');

const redisClient = new RedisClient();

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient
};
