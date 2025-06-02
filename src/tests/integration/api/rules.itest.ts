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

describe('/api/rules', () => {
  it('redirects to /api/2014/rules', async () => {
    await request(app).get('/api/rules').expect(301).expect('Location', '/api/2014/rules')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Adventuring'
    await request(app)
      .get(`/api/rules?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/rules?name=${name}`)
  })

  it('redirects to /api/2014/rules/{index}', async () => {
    const index = 'appendix'
    await request(app)
      .get(`/api/rules/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/rules/${index}`)
  })
})
