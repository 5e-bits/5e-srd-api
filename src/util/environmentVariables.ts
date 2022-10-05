const redisUrl = process.env.HEROKU_REDIS_YELLOW_URL || process.env.REDIS_URL || '';
const bugsnagApiKey = process.env.BUGSNAG_API_KEY || null;
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/5e-database';
const awsRegion = process.env.AWS_REGION || 'us-east-1';
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

export { redisUrl, bugsnagApiKey, mongodbUri, awsRegion, awsAccessKeyId, awsSecretAccessKey };
