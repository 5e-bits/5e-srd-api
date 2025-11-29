import 'dotenv/config'

import createApp from './server'
import { prewarmCache, redisClient } from './util'
import { databaseService } from './util/databaseService'

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
  const port = parseInt(process.env.PORT ?? '3000', 10)
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server listening on 0.0.0.0:${port}`)
    console.log(`📡 Health check available at: http://0.0.0.0:${port}/health`)
  })
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})
