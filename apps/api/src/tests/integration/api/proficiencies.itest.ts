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

describe('/api/proficiencies', () => {
  it('redirects to /api/2014/proficiencies', async () => {
    await request(server)
      .get('/api/proficiencies')
      .expect(301)
      .expect('Location', '/api/2014/proficiencies')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Bagpipes'
    await request(server)
      .get(`/api/proficiencies?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/proficiencies?name=${name}`)
  })

  it('redirects to /api/2014/proficiencies/{index}', async () => {
    const index = 'blowguns'
    await request(server)
      .get(`/api/proficiencies/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/proficiencies/${index}`)
  })
})
