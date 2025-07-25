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

describe('/api/subclasses', () => {
  it('redirects to /api/2014/subclasses', async () => {
    await request(app).get('/api/subclasses').expect(301).expect('Location', '/api/2014/subclasses')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Berserker'
    await request(app)
      .get(`/api/subclasses?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/subclasses?name=${name}`)
  })

  it('redirects to /api/2014/subclasses/{index}', async () => {
    const index = 'Champion'
    await request(app)
      .get(`/api/subclasses/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/subclasses/${index}`)
  })
})
