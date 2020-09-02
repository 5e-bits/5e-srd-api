const redis = require('redis');

const redisUrl = process.env.REDIS_URL || '';
const redisClient = redis.createClient(redisUrl);
const closeRedisClient = () => {
  redisClient.quit();
};

module.exports = {
  bugsnagApiKey: process.env.BUGSNAG_API_KEY || 'local',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost/5e-database',
  redisClient,
  closeRedisClient
};
