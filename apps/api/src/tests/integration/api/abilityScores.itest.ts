import { Application } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, it, vi } from 'vitest'

import createApp from '@/server'
import { mongodbUri } from '@/util/environmentVariables'
import redisClient from '@/util/RedisClient'

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

describe('/api/ability-scores', () => {
  it('redirects to /api/2014/ability-scores', async () => {
    await request(server)
      .get('/api/ability-scores')
      .expect(301)
      .expect('Location', '/api/2014/ability-scores')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'CHA'
    await request(server)
      .get(`/api/ability-scores?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/ability-scores?name=${name}`)
  })

  it('redirects to /api/2014/ability-scores/{index}', async () => {
    const index = 'strength'
    await request(server)
      .get(`/api/ability-scores/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/ability-scores/${index}`)
  })
})
