import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../globalSetup' // Adjusted path for subdirectory
import { redisClient } from '@/util' // Keep redisClient import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/2014/monsters', () => {
  it('should return a list', async () => {
    const res = await request(app).get('/api/2014/monsters')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  it('should hit the cache', async () => {
    await (redisClient as any).del('/api/2014/monsters')
    const clientSet = vi.spyOn(redisClient, 'set')
    let res = await request(app).get('/api/2014/monsters')
    res = await request(app).get('/api/2014/monsters')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
    expect(clientSet).toHaveBeenCalledTimes(1)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/monsters')
      const name = indexRes.body.results[1].name
      const res = await request(app).get(`/api/2014/monsters?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/monsters')
      const name = indexRes.body.results[1].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/monsters?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('with challenge_rating query', () => {
    describe('with only one provided challenge rating', () => {
      it('returns expected objects', async () => {
        const expectedCR = 0.25
        const res = await request(app).get(`/api/2014/monsters?challenge_rating=${expectedCR}`)
        expect(res.statusCode).toEqual(200)

        const randomIndex = Math.floor(Math.random() * res.body.results.length)
        const randomResult = res.body.results[randomIndex]

        const indexRes = await request(app).get(`/api/2014/monsters/${randomResult.index}`)
        expect(indexRes.statusCode).toEqual(200)
        expect(indexRes.body.challenge_rating).toEqual(expectedCR)
      })
    })

    describe('with many provided challenge ratings', () => {
      it('returns expected objects', async () => {
        const cr1 = 1
        const cr1Res = await request(app).get(`/api/2014/monsters?challenge_rating=${cr1}`)
        expect(cr1Res.statusCode).toEqual(200)

        const cr20 = 20
        const cr20Res = await request(app).get(`/api/2014/monsters?challenge_rating=${cr20}`)
        expect(cr20Res.statusCode).toEqual(200)

        const bothRes = await request(app).get(
          `/api/2014/monsters?challenge_rating=${cr1}&challenge_rating=${cr20}`
        )
        expect(bothRes.statusCode).toEqual(200)
        expect(bothRes.body.count).toEqual(cr1Res.body.count + cr20Res.body.count)

        const altBothRes = await request(app).get(
          `/api/2014/monsters?challenge_rating=${cr1},${cr20}`
        )
        expect(altBothRes.statusCode).toEqual(200)
        expect(altBothRes.body.count).toEqual(cr1Res.body.count + cr20Res.body.count)

        const randomIndex = Math.floor(Math.random() * bothRes.body.results.length)
        const randomResult = bothRes.body.results[randomIndex]

        const indexRes = await request(app).get(`/api/2014/monsters/${randomResult.index}`)
        expect(indexRes.statusCode).toEqual(200)
        expect(
          indexRes.body.challenge_rating == cr1 || indexRes.body.challenge_rating == cr20
        ).toBeTruthy()
      })
    })
  })
})

describe('/api/2014/monsters/:index', () => {
  it('should return one object', async () => {
    const index = 'aboleth'
    const res = await request(app).get(`/api/2014/monsters/${index}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.index).toEqual(index)
  })

  describe('with an invalid index', () => {
    it('should return 404', async () => {
      const invalidIndex = 'invalid-index'
      const res = await request(app).get(`/api/2014/monsters/${invalidIndex}`)
      expect(res.statusCode).toEqual(404)
    })
  })
})
