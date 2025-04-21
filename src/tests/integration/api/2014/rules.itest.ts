import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../globalSetup' // Adjusted path for subdirectory
import { redisClient } from '@/util' // Keep redisClient import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/2014/rules', () => {
  it('should return a list', async () => {
    const res = await request(app).get('/api/2014/rules')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  it('should hit the cache', async () => {
    await (redisClient as any).del('/api/2014/rules')
    const clientSet = vi.spyOn(redisClient, 'set')
    let res = await request(app).get('/api/2014/rules')
    res = await request(app).get('/api/2014/rules')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
    expect(clientSet).toHaveBeenCalledTimes(1)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/rules')
      const name = indexRes.body.results[1].name
      const res = await request(app).get(`/api/2014/rules?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/rules')
      const name = indexRes.body.results[1].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/rules?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('with desc query', () => {
    it('returns the object with matching desc', async () => {
      const indexRes = await request(app).get('/api/2014/rules')
      const index = indexRes.body.results[1].index
      const res = await request(app).get(`/api/2014/rules/${index}`)
      const name = res.body.name
      const descRes = await request(app).get(`/api/2014/rules?desc=${name}`)
      expect(descRes.statusCode).toEqual(200)
      expect(descRes.body.results[0].index).toEqual(index)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/rules')
      const index = indexRes.body.results[1].index
      const name = indexRes.body.results[1].name
      const queryDesc = name.toLowerCase()
      const res = await request(app).get(`/api/2014/rules?desc=${queryDesc}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].index).toEqual(index)
    })
  })
})

describe('/api/2014/rules/:index', () => {
  it('should return one object', async () => {
    const index = 'ability-checks'
    const res = await request(app).get(`/api/2014/rules/${index}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.index).toEqual(index)
  })

  describe('with an invalid index', () => {
    it('should return 404', async () => {
      const invalidIndex = 'invalid-index'
      const res = await request(app).get(`/api/2014/rules/${invalidIndex}`)
      expect(res.statusCode).toEqual(404)
    })
  })
})
