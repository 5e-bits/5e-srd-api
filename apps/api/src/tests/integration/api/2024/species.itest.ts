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

describe('/api/2024/species', () => {
  it('should list species', async () => {
    const res = await request(app).get('/api/2024/species')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2024/species')
      const name = indexRes.body.results[1].name
      const res = await request(app).get(`/api/2024/species?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2024/species')
      const name = indexRes.body.results[1].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2024/species?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('/api/2024/species/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/2024/species')
      const index = indexRes.body.results[0].index
      const showRes = await request(app).get(`/api/2024/species/${index}`)
      expect(showRes.statusCode).toEqual(200)
      expect(showRes.body.index).toEqual(index)
    })

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const showRes = await request(app).get('/api/2024/species/invalid-index')
        expect(showRes.statusCode).toEqual(404)
      })
    })
  })

  describe('/api/2024/species/:index/subspecies', () => {
    it('should return a list of subspecies for a species that has them', async () => {
      // Dragonborn has subspecies in the 2024 data
      const res = await request(app).get('/api/2024/species/dragonborn/subspecies')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
    })
  })

  describe('/api/2024/species/:index/traits', () => {
    it('should return a list of traits for a species', async () => {
      const indexRes = await request(app).get('/api/2024/species')
      const index = indexRes.body.results[0].index
      const res = await request(app).get(`/api/2024/species/${index}/traits`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results).toBeDefined()
    })
  })
})
