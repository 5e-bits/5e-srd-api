import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../globalSetup' // Adjusted path for subdirectory
import { redisClient } from '@/util' // Keep redisClient import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/2014/magic-items', () => {
  it('should return a list', async () => {
    const res = await request(app).get('/api/2014/magic-items')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  it('should hit the cache', async () => {
    await (redisClient as any).del('/api/2014/magic-items')
    const clientSet = vi.spyOn(redisClient, 'set')
    let res = await request(app).get('/api/2014/magic-items')
    res = await request(app).get('/api/2014/magic-items')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
    expect(clientSet).toHaveBeenCalledTimes(1)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/magic-items')
      const name = indexRes.body.results[5].name
      const res = await request(app).get(`/api/2014/magic-items?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/magic-items')
      const name = indexRes.body.results[5].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/magic-items?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })
})

describe('/api/2014/magic-items/:index', () => {
  it('should return one object', async () => {
    const index = 'adamantine-armor'
    const res = await request(app).get(`/api/2014/magic-items/${index}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.index).toEqual(index)
  })

  describe('with an invalid index', () => {
    it('should return 404', async () => {
      const invalidIndex = 'invalid-index'
      const res = await request(app).get(`/api/2014/magic-items/${invalidIndex}`)
      expect(res.statusCode).toEqual(404)
    })
  })
})
