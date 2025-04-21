import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../globalSetup' // Adjusted path for subdirectory

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/2014/feats', () => {
  it('should return a list', async () => {
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
})

describe('/api/2014/feats/:index', () => {
  it('should return one object', async () => {
    const index = 'grappler'
    const res = await request(app).get(`/api/2014/feats/${index}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.index).toEqual(index)
  })

  describe('with an invalid index', () => {
    it('should return 404', async () => {
      const invalidIndex = 'invalid-index'
      const res = await request(app).get(`/api/2014/feats/${invalidIndex}`)
      expect(res.statusCode).toEqual(404)
    })
  })
})
