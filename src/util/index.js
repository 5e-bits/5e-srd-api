const redis = require('redis');
const { bugsnagApiKey, mongodbUri, redisUrl } = require('./environmentVariables');

const redisClient = redis.createClient(redisUrl);
const closeRedisClient = () => {
  redisClient.quit();
};

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  closeRedisClient
};
