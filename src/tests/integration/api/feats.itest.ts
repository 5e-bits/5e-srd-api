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

describe('/api/feats', () => {
  it('redirects to /api/2014/feats', async () => {
    await request(app).get('/api/feats').expect(301).expect('Location', '/api/2014/feats')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Grappler'
    await request(app)
      .get(`/api/feats?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/feats?name=${name}`)
  })

  it('redirects to /api/2014/feats/{index}', async () => {
    const index = 'grappler'
    await request(app)
      .get(`/api/feats/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/feats/${index}`)
  })
})
