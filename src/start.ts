import 'dotenv/config'

import createApp from './server'
import { databaseService } from './util/databaseService'
import { prewarmCache, redisClient } from './util'

const start = async () => {
  console.log('Setting up MongoDB Atlas connection')

  // Debug: Log environment variables
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
  console.log('TEST_MONGODB_URI:', process.env.TEST_MONGODB_URI ? 'Set' : 'Not set')

  // Connect to MongoDB Atlas
  await databaseService.connect()

  // Connect to Redis
  try {
    await redisClient.connect()
    console.log('✅ Redis connection ready')

    console.log('Flushing Redis')
    await redisClient.flushAll()

    console.log('Prewarm Redis')
    await prewarmCache()
  } catch (error) {
    console.log('⚠️  Redis connection failed, continuing without caching')
    console.log('Redis error:', error instanceof Error ? error.message : String(error))
  }

  console.log('Setting up Express server')
  const app = await createApp()

  console.log('Starting server...')
  const port = process.env.PORT ?? 3000
  app.listen(port, () => {
    console.log(`Listening on port ${port}! 🚀`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
