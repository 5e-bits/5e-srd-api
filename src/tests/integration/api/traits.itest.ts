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

describe('/api/traits', () => {
  it('redirects to /api/2014/traits', async () => {
    await request(app).get('/api/traits').expect(301).expect('Location', '/api/2014/traits')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Brave'
    await request(app)
      .get(`/api/traits?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/traits?name=${name}`)
  })

  it('redirects to /api/2014/traits/{index}', async () => {
    const index = 'darkvision'
    await request(app)
      .get(`/api/traits/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/traits/${index}`)
  })
})
