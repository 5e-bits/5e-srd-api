const redisUrl = process.env.REDIS_URL || '';
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || 'local';
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/5e-database';
const realmAppId = process.env.REALM_APP_ID || '';
const realmApiKey = process.env.REALM_API_KEY || '';

module.exports = {
  redisUrl,
  bugsnagApiKey,
  mongodbUri,
  realmAppId,
  realmApiKey,
};
