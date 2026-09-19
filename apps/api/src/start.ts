import mongoose from 'mongoose'

import createApp from './server'
import { mongodbUri, prewarmCache, redisClient } from './util'

const start = async () => {
  console.log('Setting up MongoDB')
  // Mongoose: the `strictQuery` option will be switched back to `false` by
  // default in Mongoose 7, when we update to Mongoose 7 we can remove this.
  mongoose.set('strictQuery', false)

  await mongoose.connect(mongodbUri)
  console.log('Database connection ready')

  redisClient.on('error', (err) => console.log('Redis Client Error', err))

  await redisClient.connect()
  console.log('Redis connection ready')

  console.log('Flushing Redis')
  await redisClient.flushAll()

  console.log('Prewarm Redis')
  await prewarmCache()

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
