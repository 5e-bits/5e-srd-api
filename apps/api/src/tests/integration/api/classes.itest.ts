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

describe('/api/classes', () => {
  it('redirects to /api/2014/classes', async () => {
    await request(server).get('/api/classes').expect(301).expect('Location', '/api/2014/classes')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Cleric'
    await request(server)
      .get(`/api/classes?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/classes?name=${name}`)
  })

  it('redirects to /api/2014/classes/{index}', async () => {
    const index = 'bard'
    await request(server)
      .get(`/api/classes/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/classes/${index}`)
  })
})
