const redis = require('redis');

const redisUrl = process.env.REDIS_URL || '';
const redisClient = redis.createClient(redisUrl);
const closeRedisClient = callback => {
  redisClient.quit(callback);
};

module.exports = {
  bugsnagApiKey: process.env.BUGSNAG_API_KEY || 'local',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost/5e-database',
  redisClient,
  closeRedisClient
};
