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

describe('/api/equipment', () => {
  it('redirects to /api/2014/equipment', async () => {
    await request(app).get('/api/equipment').expect(301).expect('Location', '/api/2014/equipment')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Abacus'
    await request(app)
      .get(`/api/equipment?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment?name=${name}`)
  })

  it('redirects to /api/2014/equipment/{index}', async () => {
    const index = 'acid-vial'
    await request(app)
      .get(`/api/equipment/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment/${index}`)
  })
})
