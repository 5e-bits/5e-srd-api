import { Application } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

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
  server = app.listen()
})

afterAll(async () => {
  await mongoose.disconnect()
  await redisClient.quit()
  server.close()
})

describe('/api/2024/classes', () => {
  it('should list classes', async () => {
    const res = await request(server).get('/api/2024/classes')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(server).get('/api/2024/classes')
      const name = indexRes.body.results[0].name
      const res = await request(server).get(`/api/2024/classes?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(server).get('/api/2024/classes')
      const name = indexRes.body.results[0].name
      const res = await request(server).get(`/api/2024/classes?name=${name.toLowerCase()}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('/api/2024/classes/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(server).get('/api/2024/classes')
      const index = indexRes.body.results[0].index
      const showRes = await request(server).get(`/api/2024/classes/${index}`)
      expect(showRes.statusCode).toEqual(200)
      expect(showRes.body.index).toEqual(index)
    })

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const showRes = await request(server).get('/api/2024/classes/invalid-index')
        expect(showRes.statusCode).toEqual(404)
      })
    })

    describe('/api/2024/classes/:index/spells', () => {
      it('returns objects for a spellcasting class', async () => {
        const res = await request(server).get('/api/2024/classes/wizard/spells')
        expect(res.statusCode).toEqual(200)
        expect(res.body.results.length).not.toEqual(0)
      })

      it('returns 404 for an invalid class index', async () => {
        const res = await request(server).get('/api/2024/classes/invalid-index/spells')
        expect(res.statusCode).toEqual(404)
      })
    })

    describe('/api/2024/classes/:index/levels', () => {
      it('returns objects', async () => {
        const indexRes = await request(server).get('/api/2024/classes')
        const index = indexRes.body.results[0].index
        const res = await request(server).get(`/api/2024/classes/${index}/levels`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(20)
      })

      it('includes subclass levels matching the subclass query param', async () => {
        const indexRes = await request(server).get('/api/2024/classes')
        const index = indexRes.body.results[0].index
        const classRes = await request(server).get(`/api/2024/classes/${index}`)
        const subclass = classRes.body.subclasses[0].index
        const res = await request(server).get(
          `/api/2024/classes/${index}/levels?subclass=${subclass}`
        )
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toBeGreaterThan(20)
      })

      describe('/api/2024/classes/:index/levels/:level', () => {
        it('returns objects', async () => {
          const indexRes = await request(server).get('/api/2024/classes')
          const index = indexRes.body.results[0].index
          const level = 1
          const res = await request(server).get(`/api/2024/classes/${index}/levels/${level}`)
          expect(res.statusCode).toEqual(200)
          expect(res.body.level).toEqual(level)
        })

        it('returns 400 for an out-of-range level', async () => {
          const indexRes = await request(server).get('/api/2024/classes')
          const index = indexRes.body.results[0].index
          const res = await request(server).get(`/api/2024/classes/${index}/levels/21`)
          expect(res.statusCode).toEqual(400)
        })
      })

      describe('/api/2024/classes/:index/levels/:level/features', () => {
        it('returns objects', async () => {
          const indexRes = await request(server).get('/api/2024/classes')
          const index = indexRes.body.results[0].index
          const level = 1
          const res = await request(server).get(
            `/api/2024/classes/${index}/levels/${level}/features`
          )
          expect(res.statusCode).toEqual(200)
          expect(res.body.results.length).not.toEqual(0)
        })
      })

      describe('/api/2024/classes/:index/levels/:level/spells', () => {
        it('returns spells for a spellcasting class at a given level', async () => {
          const res = await request(server).get('/api/2024/classes/wizard/levels/3/spells')
          expect(res.statusCode).toEqual(200)
          expect(res.body.results.length).not.toEqual(0)
        })

        it('returns an empty list for a non-spellcasting class', async () => {
          const res = await request(server).get('/api/2024/classes/fighter/levels/1/spells')
          expect(res.statusCode).toEqual(200)
          expect(res.body.results).toEqual([])
        })
      })
    })
  })
})
