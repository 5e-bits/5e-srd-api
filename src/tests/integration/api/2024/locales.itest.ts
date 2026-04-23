import { Application } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

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
  server = app.listen()
})

afterAll(async () => {
  await mongoose.disconnect()
  await redisClient.quit()
  server.close()
})

describe('/api/2024/locales', () => {
  it('should return a list (possibly empty when no translations are loaded)', async () => {
    const res = await request(app).get('/api/2024/locales')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('count')
    expect(res.body).toHaveProperty('results')
    expect(Array.isArray(res.body.results)).toBe(true)
  })

  describe('/api/2024/locales/:lang', () => {
    it('should return 404 for an unknown locale', async () => {
      const res = await request(app).get('/api/2024/locales/xx')
      expect(res.statusCode).toEqual(404)
    })
  })
})
