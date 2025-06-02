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

describe('/api/languages', () => {
  it('redirects to /api/2014/languages', async () => {
    await request(app).get('/api/languages').expect(301).expect('Location', '/api/2014/languages')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Abyssal'
    await request(app)
      .get(`/api/languages?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/languages?name=${name}`)
  })

  it('redirects to /api/2014/languages/{index}', async () => {
    const index = 'celestial'
    await request(app)
      .get(`/api/languages/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/languages/${index}`)
  })
})
