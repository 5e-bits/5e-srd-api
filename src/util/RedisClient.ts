import { createClient } from 'redis'

import { redisUrl } from './environmentVariables'

// Create Redis client with proper error handling
const createRedisClient = () => {
  try {
    const isTls = redisUrl.match(/rediss:/) != null
    const parsedUrl = new URL(redisUrl)

    const client = createClient({
      url: redisUrl,
      socket: isTls
        ? {
            tls: true,
            host: parsedUrl.hostname,
            rejectUnauthorized: false
          }
        : undefined
    })

    // Add error handling
    client.on('error', (err) => {
      console.log('Redis Client Error:', err)
    })

    return client
  } catch (error) {
    console.log(
      'Failed to create Redis client:',
      error instanceof Error ? error.message : String(error)
    )
    // Return a mock client for development/testing
    return {
      get: async () => null,
      set: async () => 'OK',
      setEx: async () => 'OK',
      del: async () => 0,
      connect: async () => {},
      quit: async () => {},
      flushAll: async () => 'OK',
      on: () => {}
    } as any
  }
}

const redisClient = createRedisClient()

export default redisClient
