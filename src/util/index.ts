import { ResourceList } from './data'
import { bugsnagApiKey, mongodbUri } from './environmentVariables'

import { escapeRegExp } from './regex'
import prewarmCache from './prewarmCache'
import realRedisClient from './RedisClient'
import awsS3Client from './awsS3Client'

// Create a mock client for testing
const mockRedisClient = {
  get: async (_key: string) => null, // Always cache miss
  set: async (_key: string, _value: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connect: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  quit: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  flushDb: async () => {},
  isOpen: false // Mock status
  // Add other methods used by the app as needed, mocking their behavior
}

// Conditionally export the real or mock client
const redisClient = process.env.NODE_ENV === 'test' ? mockRedisClient : realRedisClient

export {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  prewarmCache,
  escapeRegExp,
  ResourceList,
  awsS3Client
}
