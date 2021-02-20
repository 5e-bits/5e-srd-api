const redisUrl = process.env.REDIS_URL || '';
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || 'local';
const mongodbUri = process.env.MONGODB_URI_RULESET;

module.exports = {
  redisUrl,
  bugsnagApiKey,
  mongodbUri,
};
