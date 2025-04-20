import { MongoMemoryServer } from 'mongodb-memory-server'
import { RedisMemoryServer } from 'redis-memory-server'
import { type RedisMemoryServerOptsT } from 'redis-memory-server/lib/RedisMemoryServer' // Fixed type import
import path from 'path'
import * as os from 'os'

// Define types for global variables
// Use declare global {} for augmenting the global scope safely
declare global {
  // eslint-disable-next-line no-var
  var __MONGOD__: MongoMemoryServer | undefined
  // eslint-disable-next-line no-var
  var __REDISD__: RedisMemoryServer | undefined
}

// Function to generate a temporary directory path for Redis
const getTmpDir = (): string => {
  return path.join(os.tmpdir(), 'redis-memory-server', `_${Date.now().toString(36)}`)
}

export async function setup(): Promise<() => Promise<void>> {
  console.log('\n[Global Setup] Starting test servers...')

  // --- Redis Setup ---
  // redis-memory-server sometimes needs an explicit binary path or temporary directory
  const redisOptions: Partial<RedisMemoryServerOptsT> = {
    instance: {
      port: undefined // Use any free port
    }
    // You might need to uncomment and adjust the binary path if auto-download fails
    // binary: {
    //   // checkArch: true, // default
    //   // checkOs: true, // default
    //   // systemBinary: '/usr/local/bin/redis-server', // Example path
    //   // version: '7.x', // Optional: specify version
    // },
    // Specify a unique temporary directory for each run
    // downloadDir: getTmpDir(), // Use this if experiencing issues with default download location
  }
  try {
    console.log('[Global Setup] Starting RedisMemoryServer...')
    const redisd = await RedisMemoryServer.create(redisOptions)
    const redisHost = await redisd.getHost()
    const redisPort = await redisd.getPort()
    const redisUrl = `redis://${redisHost}:${redisPort}`
    process.env.TEST_REDIS_URL = redisUrl // Set env var for tests
    globalThis.__REDISD__ = redisd // Store instance globally
    console.log(`[Global Setup] RedisMemoryServer started at: ${redisUrl}`)
  } catch (error) {
    console.error('[Global Setup] Failed to start RedisMemoryServer:', error)
    // Optionally, re-throw or handle the error to prevent tests from running
    // without Redis, depending on your requirements.
    throw new Error(
      `Failed to start RedisMemoryServer: ${error instanceof Error ? error.message : error}`
    )
  }

  // --- MongoDB Setup ---
  try {
    console.log('[Global Setup] Starting MongoMemoryServer...')
    const mongod = await MongoMemoryServer.create()
    const mongoUri = mongod.getUri()
    process.env.TEST_MONGODB_URI = mongoUri // Set env var for tests
    globalThis.__MONGOD__ = mongod // Store instance globally
    console.log(`[Global Setup] MongoMemoryServer started at: ${mongoUri}`)
  } catch (error) {
    console.error('[Global Setup] Failed to start MongoMemoryServer:', error)
    // Attempt to clean up Redis if Mongo fails
    if (globalThis.__REDISD__) {
      await globalThis.__REDISD__.stop()
    }
    throw new Error(
      `Failed to start MongoMemoryServer: ${error instanceof Error ? error.message : error}`
    )
  }

  console.log('[Global Setup] Test servers running.')

  // Return the teardown function
  return async () => {
    console.log('\n[Global Teardown] Stopping test servers...')
    if (globalThis.__REDISD__) {
      try {
        await globalThis.__REDISD__.stop()
        console.log('[Global Teardown] RedisMemoryServer stopped.')
      } catch (error) {
        console.error('[Global Teardown] Error stopping RedisMemoryServer:', error)
      }
      globalThis.__REDISD__ = undefined
    }
    if (globalThis.__MONGOD__) {
      try {
        await globalThis.__MONGOD__.stop()
        console.log('[Global Teardown] MongoMemoryServer stopped.')
      } catch (error) {
        console.error('[Global Teardown] Error stopping MongoMemoryServer:', error)
      }
      globalThis.__MONGOD__ = undefined
    }
    console.log('[Global Teardown] Test servers stopped.')
  }
}
