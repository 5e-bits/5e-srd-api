const redis = require('redis');
const { redisUrl, bugsnagApiKey, mongodbUri } = require('./environmentVariables');

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
