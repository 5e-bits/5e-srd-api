import { MongoMemoryServer } from 'mongodb-memory-server'
// import { RedisMemoryServer } from 'redis-memory-server' // Removed
// import { type RedisMemoryServerOptsT } from 'redis-memory-server/lib/RedisMemoryServer' // Removed
import path from 'path'
import * as os from 'os'

// Define types for global variables
// Use declare global {} for augmenting the global scope safely
declare global {
  // eslint-disable-next-line no-var
  var __MONGOD__: MongoMemoryServer | undefined
  // eslint-disable-next-line no-var
  // var __REDISD__: RedisMemoryServer | undefined // Removed
}

// Function to generate a temporary directory path for Redis
// Removed getTmpDir as it's no longer needed

export async function setup(): Promise<() => Promise<void>> {
  console.log('\n[Global Setup - Unit Tests] Starting test servers...')

  // --- Redis Setup --- Removed ---
  // No RedisMemoryServer setup needed for unit tests, rely on mocking.

  // --- MongoDB Setup ---
  try {
    console.log('[Global Setup - Unit Tests] Starting MongoMemoryServer...')
    const mongod = await MongoMemoryServer.create()
    const baseMongoUri = mongod.getUri().split('?')[0]
    const serverUri = baseMongoUri.endsWith('/') ? baseMongoUri : baseMongoUri + '/'

    process.env.TEST_MONGODB_URI_BASE = serverUri // Set env var for tests
    globalThis.__MONGOD__ = mongod // Store instance globally
    console.log(`[Global Setup - Unit Tests] MongoMemoryServer started at base URI: ${serverUri}`)
  } catch (error) {
    console.error('[Global Setup - Unit Tests] Failed to start MongoMemoryServer:', error)
    // // Attempt to clean up Redis if Mongo fails // Removed Redis part
    // if (globalThis.__REDISD__) {
    //   await globalThis.__REDISD__.stop()
    // }
    throw new Error(
      `Failed to start MongoMemoryServer: ${error instanceof Error ? error.message : error}`
    )
  }

  console.log('[Global Setup - Unit Tests] MongoMemoryServer running.')

  // Return the teardown function
  return async () => {
    console.log('\n[Global Teardown - Unit Tests] Stopping test servers...')
    // if (globalThis.__REDISD__) { // Removed Redis part
    //   try {
    //     await globalThis.__REDISD__.stop()
    //     console.log('[Global Teardown - Unit Tests] RedisMemoryServer stopped.')
    //   } catch (error) {
    //     console.error('[Global Teardown - Unit Tests] Error stopping RedisMemoryServer:', error)
    //   }
    //   globalThis.__REDISD__ = undefined
    // }
    if (globalThis.__MONGOD__) {
      try {
        await globalThis.__MONGOD__.stop()
        console.log('[Global Teardown - Unit Tests] MongoMemoryServer stopped.')
      } catch (error) {
        console.error('[Global Teardown - Unit Tests] Error stopping MongoMemoryServer:', error)
      }
      globalThis.__MONGOD__ = undefined
    }
    console.log('[Global Teardown - Unit Tests] MongoMemoryServer stopped.')
  }
}
