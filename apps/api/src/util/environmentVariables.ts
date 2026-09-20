const isTestEnv = process.env.NODE_ENV === 'test'

const redisUrl =
  process.env.HEROKU_REDIS_YELLOW_URL ?? process.env.REDIS_URL ?? 'redis://localhost:6379'
const bugsnagApiKey = process.env.BUGSNAG_API_KEY ?? null
const mongodbUri =
  (isTestEnv ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI) ??
  'mongodb://localhost/5e-database'

const awsRegion = process.env.AWS_REGION ?? 'us-west-1'

export { awsRegion, bugsnagApiKey, mongodbUri, redisUrl }
