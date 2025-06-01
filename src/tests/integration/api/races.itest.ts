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

describe('/api/races', () => {
  it('redirects to /api/2014/races', async () => {
    await request(app).get('/api/races').expect(301).expect('Location', '/api/2014/races')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Dragonborn'
    await request(app)
      .get(`/api/races?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/races?name=${name}`)
  })

  it('redirects to /api/2014/races/{index}', async () => {
    const index = 'dwarf'
    await request(app)
      .get(`/api/races/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/races/${index}`)
  })
})
