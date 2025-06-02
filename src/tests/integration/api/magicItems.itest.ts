import { Application } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, it, vi } from 'vitest'

import createApp from '@/server'
import { mongodbUri, redisClient } from '@/util'

let app: Application
let server: any

afterEach(() => {
  vi.clearAllMocks()
})

beforeAll(async () => {
  await mongoose.connect(mongodbUri)
  await redisClient.connect()
  app = await createApp()
  server = app.listen() // Start the server and store the instance
})

afterAll(async () => {
  await mongoose.disconnect()
  await redisClient.quit()
  server.close()
})

describe('/api/magic-items', () => {
  it('redirects to /api/2014/magic-items', async () => {
    await request(app)
      .get('/api/magic-items')
      .expect(301)
      .expect('Location', '/api/2014/magic-items')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Adamantine%20Armor'
    await request(app)
      .get(`/api/magic-items?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-items?name=${name}`)
  })

  it('redirects to /api/2014/magic-items/{index}', async () => {
    const index = 'ammunition'
    await request(app)
      .get(`/api/magic-items/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-items/${index}`)
  })
})
