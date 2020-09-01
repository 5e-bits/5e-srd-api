module.exports = {
  bugsnagApiKey: process.env.BUGSNAG_API_KEY || 'local',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost/5e-database',
  redisUrl: process.env.REDIS_URL || ''
};
