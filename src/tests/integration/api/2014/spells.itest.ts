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

describe('/api/2014/spells', () => {
  it('should list spells', async () => {
    const res = await request(app).get('/api/2014/spells')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  it('should hit the cache', async () => {
    await redisClient.del('/api/2014/spells')
    const clientSet = vi.spyOn(redisClient, 'set')
    let res = await request(app).get('/api/2014/spells')
    res = await request(app).get('/api/2014/spells')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
    expect(clientSet).toHaveBeenCalledTimes(1)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/spells')
      const name = indexRes.body.results[1].name
      const res = await request(app).get(`/api/2014/spells?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/spells')
      const name = indexRes.body.results[1].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/spells?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('with level query', () => {
    it('returns expected objects', async () => {
      const expectedLevel = 2
      const res = await request(app).get(`/api/2014/spells?level=${expectedLevel}`)
      expect(res.statusCode).toEqual(200)

      const randomIndex = Math.floor(Math.random() * res.body.results.length)
      const randomResult = res.body.results[randomIndex]

      const indexRes = await request(app).get(`/api/2014/spells/${randomResult.index}`)
      expect(indexRes.statusCode).toEqual(200)
      expect(indexRes.body.level).toEqual(expectedLevel)
    })

    describe('with many provided level', () => {
      it('returns expected objects', async () => {
        const expectedLevel1 = 1
        const res1 = await request(app).get(`/api/2014/spells?level=${expectedLevel1}`)
        expect(res1.statusCode).toEqual(200)

        const expectLevel2 = 8
        const res2 = await request(app).get(`/api/2014/spells?level=${expectLevel2}`)
        expect(res2.statusCode).toEqual(200)

        const bothRes = await request(app).get(
          `/api/2014/spells?level=${expectedLevel1}&level=${expectLevel2}`
        )
        expect(bothRes.statusCode).toEqual(200)
        expect(bothRes.body.count).toEqual(res1.body.count + res2.body.count)

        const randomIndex = Math.floor(Math.random() * bothRes.body.results.length)
        const randomResult = bothRes.body.results[randomIndex]

        const indexRes = await request(app).get(`/api/2014/spells/${randomResult.index}`)
        expect(indexRes.statusCode).toEqual(200)
        expect(
          indexRes.body.level == expectedLevel1 || indexRes.body.level == expectLevel2
        ).toBeTruthy()
      })
    })
  })

  describe('with school query', () => {
    it('returns expected objects', async () => {
      const expectedSchool = 'Illusion'
      const res = await request(app).get(`/api/2014/spells?school=${expectedSchool}`)
      expect(res.statusCode).toEqual(200)

      const randomIndex = Math.floor(Math.random() * res.body.results.length)
      const randomResult = res.body.results[randomIndex]

      const indexRes = await request(app).get(`/api/2014/spells/${randomResult.index}`)
      expect(indexRes.statusCode).toEqual(200)
      expect(indexRes.body.school.name).toEqual(expectedSchool)
    })

    describe('with many provided schools', () => {
      it('returns expected objects', async () => {
        const expectedSchool1 = 'Illusion'
        const res1 = await request(app).get(`/api/2014/spells?school=${expectedSchool1}`)
        expect(res1.statusCode).toEqual(200)

        const expectedSchool2 = 'Evocation'
        const res2 = await request(app).get(`/api/2014/spells?school=${expectedSchool2}`)
        expect(res2.statusCode).toEqual(200)

        const bothRes = await request(app).get(
          `/api/2014/spells?school=${expectedSchool1}&school=${expectedSchool2}`
        )
        expect(bothRes.statusCode).toEqual(200)
        expect(bothRes.body.count).toEqual(res1.body.count + res2.body.count)

        const randomIndex = Math.floor(Math.random() * bothRes.body.results.length)
        const randomResult = bothRes.body.results[randomIndex]

        const indexRes = await request(app).get(`/api/2014/spells/${randomResult.index}`)
        expect(indexRes.statusCode).toEqual(200)
        expect(
          indexRes.body.school.name == expectedSchool1 ||
            indexRes.body.school.name == expectedSchool2
        ).toBeTruthy()
      })
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/spells')
      const index = indexRes.body.results[0].index
      const showRes = await request(app).get(`/api/2014/spells/${index}`)
      const school = showRes.body.school.name
      const querySchool = school.toLowerCase()
      const res = await request(app).get(`/api/2014/spells?school=${querySchool}`)

      const randomIndex = Math.floor(Math.random() * res.body.results.length)
      const randomResult = res.body.results[randomIndex]

      const queryRes = await request(app).get(`/api/2014/spells/${randomResult.index}`)
      expect(queryRes.statusCode).toEqual(200)
      expect(queryRes.body.school.name).toEqual(school)
    })
  })

  describe('/api/2014/spells/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/2014/spells')
      const index = indexRes.body.results[0].index
      const showRes = await request(app).get(`/api/2014/spells/${index}`)
      expect(showRes.statusCode).toEqual(200)
      expect(showRes.body.index).toEqual(index)
    })

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index'
        const showRes = await request(app).get(`/api/2014/spells/${invalidIndex}`)
        expect(showRes.statusCode).toEqual(404)
      })
    })
  })
})
