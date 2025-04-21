import { Application } from 'express'
import type { Server } from 'http'
import mongoose from 'mongoose'
import { mongodbUri, redisClient } from '@/util'
import createApp from '@/server'

// Exported variables to hold the app and server instances
export let app: Application
export let server: Server

export async function setup() {
  console.log('Starting global setup for integration tests...')
  try {
    await mongoose.connect(mongodbUri)
    console.log('MongoDB connected.')
    await redisClient.connect()
    console.log('Redis connected.')
    app = await createApp()
    server = app.listen() // Let OS assign a random available port
    const address = server.address()
    if (typeof address === 'object' && address !== null) {
      // Make port available globally if needed, e.g., via process.env
      // process.env.TEST_SERVER_PORT = String(address.port);
      console.log(`Test server started on port ${address.port}`)
    } else {
      console.log('Test server started.')
    }
  } catch (error) {
    console.error('Error during global setup:', error)
    // Ensure cleanup happens even if setup fails partially
    await teardown()
    process.exit(1) // Exit if setup fails critically
  }
}

export async function teardown() {
  console.log('Starting global teardown for integration tests...')
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            console.error('Error closing server:', err)
            return reject(err)
          }
          console.log('Test server closed.')
          resolve()
        })
      })
    }
    await mongoose.disconnect()
    console.log('MongoDB disconnected.')
    // Use quit() for node-redis v4+
    if (typeof redisClient.quit === 'function') {
      await redisClient.quit()
      console.log('Redis disconnected (quit).')
    } else if (typeof (redisClient as any).disconnect === 'function') {
      // Fallback for older versions or different redis clients
      await (redisClient as any).disconnect()
      console.log('Redis disconnected (disconnect).')
    }
  } catch (error) {
    console.error('Error during global teardown:', error)
  }
}
