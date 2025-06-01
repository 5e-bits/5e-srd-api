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

describe('/api/skills', () => {
  it('redirects to /api/2014/skills', async () => {
    await request(app).get('/api/skills').expect(301).expect('Location', '/api/2014/skills')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Acrobatics'
    await request(app)
      .get(`/api/skills?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/skills?name=${name}`)
  })

  it('redirects to /api/2014/skills/{index}', async () => {
    const index = 'arcana'
    await request(app)
      .get(`/api/skills/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/skills/${index}`)
  })
})
