const RedisClient = require('./RedisClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');

const redisClient = RedisClient.createClient();

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient
};
