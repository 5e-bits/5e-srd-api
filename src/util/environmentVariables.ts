const redisUrl = process.env.HEROKU_REDIS_YELLOW_URL || process.env.REDIS_URL || '';
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || null;
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/5e-database';

export { redisUrl, bugsnagApiKey, mongodbUri };
