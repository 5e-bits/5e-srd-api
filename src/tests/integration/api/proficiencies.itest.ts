import { mongodbUri, redisClient } from '@/util'

import { Application } from 'express'
import createApp from '@/server'
import { jest } from '@jest/globals'
import mongoose from 'mongoose'
import request from 'supertest'

let app: Application
let server: any

afterEach(() => {
  jest.clearAllMocks()
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
    await request(app)
      .get('/api/proficiencies')
      .expect(301)
      .expect('Location', '/api/2014/proficiencies')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Bagpipes'
    await request(app)
      .get(`/api/proficiencies?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/proficiencies?name=${name}`)
  })

  it('redirects to /api/2014/proficiencies/{index}', async () => {
    const index = 'blowguns'
    await request(app)
      .get(`/api/proficiencies/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/proficiencies/${index}`)
  })
})
