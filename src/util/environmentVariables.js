const redisUrl = process.env.REDIS_URL || '';
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || 'local';
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/5e-database';

module.exports = {
  redisUrl,
  bugsnagApiKey,
  mongodbUri
};
