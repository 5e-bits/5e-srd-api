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

describe('/api/rule-sections', () => {
  it('redirects to /api/2014/rule-sections', async () => {
    await request(app)
      .get('/api/rule-sections')
      .expect(301)
      .expect('Location', '/api/2014/rule-sections')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Ability%20Checks'
    await request(app)
      .get(`/api/rule-sections?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/rule-sections?name=${name}`)
  })

  it('redirects to /api/2014/rule-sections/{index}', async () => {
    const index = 'actions-in-combat'
    await request(app)
      .get(`/api/rule-sections/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/rule-sections/${index}`)
  })
})
