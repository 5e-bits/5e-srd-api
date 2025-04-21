import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../globalSetup' // Adjusted path for subdirectory

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/2014/subraces', () => {
  it('should return a list', async () => {
    const res = await request(app).get('/api/2014/subraces')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/subraces')
      const name = indexRes.body.results[1].name
      const res = await request(app).get(`/api/2014/subraces?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/subraces')
      const name = indexRes.body.results[1].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/subraces?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })
})

describe('/api/2014/subraces/:index', () => {
  it('should return one object', async () => {
    const index = 'high-elf'
    const res = await request(app).get(`/api/2014/subraces/${index}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.index).toEqual(index)
  })

  describe('with an invalid index', () => {
    it('should return 404', async () => {
      const invalidIndex = 'invalid-index'
      const showRes = await request(app).get(`/api/2014/subraces/${invalidIndex}`)
      expect(showRes.statusCode).toEqual(404)
    })
  })

  describe('/api/2014/subraces/:index/traits', () => {
    it('returns objects', async () => {
      const indexRes = await request(app).get('/api/2014/subraces')
      const index = indexRes.body.results[1].index
      const res = await request(app).get(`/api/2014/subraces/${index}/traits`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results.length).not.toEqual(0)
    })
  })

  describe('/api/2014/subraces/:index/proficiencies', () => {
    it('returns objects', async () => {
      const res = await request(app).get('/api/2014/subraces/high-elf/proficiencies')
      expect(res.statusCode).toEqual(200)
      expect(res.body.results.length).not.toEqual(0)
    })
  })
})
