const redisUrl = process.env.REDIS_URL || '';
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || 'local';
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/5e-database';

module.exports = {
  redisUrl,
  redisHost,
  redisPort,
  bugsnagApiKey,
  mongodbUri,
};
