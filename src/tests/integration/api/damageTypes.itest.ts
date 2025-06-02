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

describe('/api/damage-types', () => {
  it('redirects to /api/2014/damage-types', async () => {
    await request(app)
      .get('/api/damage-types')
      .expect(301)
      .expect('Location', '/api/2014/damage-types')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Acid'
    await request(app)
      .get(`/api/damage-types?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/damage-types?name=${name}`)
  })

  it('redirects to /api/2014/damage-types/{index}', async () => {
    const index = 'cold'
    await request(app)
      .get(`/api/damage-types/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/damage-types/${index}`)
  })
})
