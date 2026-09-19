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

describe('/api/2024/spells', () => {
  it('should list spells', async () => {
    const res = await request(server).get('/api/2024/spells')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(server).get('/api/2024/spells')
      const name = indexRes.body.results[0].name
      const res = await request(server).get(`/api/2024/spells?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(server).get('/api/2024/spells')
      const name = indexRes.body.results[0].name
      const res = await request(server).get(`/api/2024/spells?name=${name.toLowerCase()}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('with level query', () => {
    it('returns expected objects', async () => {
      const expectedLevel = 2
      const res = await request(server).get(`/api/2024/spells?level=${expectedLevel}`)
      expect(res.statusCode).toEqual(200)

      const randomIndex = Math.floor(Math.random() * res.body.results.length)
      const randomResult = res.body.results[randomIndex]

      const indexRes = await request(server).get(`/api/2024/spells/${randomResult.index}`)
      expect(indexRes.statusCode).toEqual(200)
      expect(indexRes.body.level).toEqual(expectedLevel)
    })
  })

  describe('with school query', () => {
    it('returns expected objects', async () => {
      const expectedSchool = 'Evocation'
      const res = await request(server).get(`/api/2024/spells?school=${expectedSchool}`)
      expect(res.statusCode).toEqual(200)

      const randomIndex = Math.floor(Math.random() * res.body.results.length)
      const randomResult = res.body.results[randomIndex]

      const indexRes = await request(server).get(`/api/2024/spells/${randomResult.index}`)
      expect(indexRes.statusCode).toEqual(200)
      expect(indexRes.body.school.name).toEqual(expectedSchool)
    })
  })

  describe('/api/2024/spells/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(server).get('/api/2024/spells')
      const index = indexRes.body.results[0].index
      const showRes = await request(server).get(`/api/2024/spells/${index}`)
      expect(showRes.statusCode).toEqual(200)
      expect(showRes.body.index).toEqual(index)
    })

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const showRes = await request(server).get('/api/2024/spells/invalid-index')
        expect(showRes.statusCode).toEqual(404)
      })
    })
  })
})
