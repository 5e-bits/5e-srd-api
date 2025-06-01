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
  server = app.listen() // Start the server and store the instance
})

afterAll(async () => {
  await mongoose.disconnect()
  await redisClient.quit()
  server.close()
})

describe('/api/2014/feats', () => {
  it('should list feats', async () => {
    const res = await request(app).get('/api/2014/feats')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/feats')
      const name = indexRes.body.results[0].name
      const res = await request(app).get(`/api/2014/feats?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/feats')
      const name = indexRes.body.results[0].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/feats?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('/api/2014/feats/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/2014/feats')
      const index = indexRes.body.results[0].index
      const showRes = await request(app).get(`/api/2014/feats/${index}`)
      expect(showRes.statusCode).toEqual(200)
      expect(showRes.body.index).toEqual(index)
    })

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index'
        const showRes = await request(app).get(`/api/2014/feats/${invalidIndex}`)
        expect(showRes.statusCode).toEqual(404)
      })
    })
  })
})
