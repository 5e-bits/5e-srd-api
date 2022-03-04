const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisUsername = process.env.REDIS_USERNAME || '';
const redisPassword = process.env.REDIS_PASSWORD || '';
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || 'local';
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/5e-database';

module.exports = {
  redisHost,
  redisPort,
  redisUsername,
  redisPassword,
  bugsnagApiKey,
  mongodbUri,
};
