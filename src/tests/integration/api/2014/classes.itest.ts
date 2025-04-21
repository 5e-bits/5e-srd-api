import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../globalSetup' // Adjusted path for subdirectory

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/2014/classes', () => {
  it('should return a list', async () => {
    const res = await request(app).get('/api/2014/classes')
    expect(res.statusCode).toEqual(200)
    expect(res.body.results.length).not.toEqual(0)
  })

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/classes')
      const name = indexRes.body.results[1].name
      const res = await request(app).get(`/api/2014/classes?name=${name}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/classes')
      const name = indexRes.body.results[1].name
      const queryName = name.toLowerCase()
      const res = await request(app).get(`/api/2014/classes?name=${queryName}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.results[0].name).toEqual(name)
    })
  })

  describe('/api/2014/classes/:index', () => {
    it('should return one object', async () => {
      const index = 'barbarian'
      const res = await request(app).get(`/api/2014/classes/${index}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.index).toEqual(index)
    })

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index'
        const showRes = await request(app).get(`/api/2014/classes/${invalidIndex}`)
        expect(showRes.statusCode).toEqual(404)
      })
    })

    describe('/api/2014/classes/:index/subclasses', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/subclasses`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.results.length).not.toEqual(0)
      })
    })

    describe('/api/2014/classes/:index/starting-equipment', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/starting-equipment`)
        expect(res.statusCode).toEqual(200)
      })
    })

    describe('/api/2014/classes/:index/spellcasting', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/spellcasting`)
        expect(res.statusCode).toEqual(200)
      })
    })

    describe('/api/2014/classes/:index/spells', () => {
      it('returns objects', async () => {
        const res = await request(app).get('/api/2014/classes/wizard/spells')
        expect(res.statusCode).toEqual(200)
        expect(res.body.results.length).not.toEqual(0)
      })
    })

    describe('/api/2014/classes/:index/features', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/features`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.results.length).not.toEqual(0)
      })
    })

    describe('/api/2014/classes/:index/proficiencies', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/proficiencies`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.results.length).not.toEqual(0)
      })
    })

    describe('/api/2014/classes/:index/multi-classing', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/multi-classing`)
        expect(res.statusCode).toEqual(200)
      })
    })

    describe('/api/2014/classes/:index/levels', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const res = await request(app).get(`/api/2014/classes/${index}/levels`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).not.toEqual(0)
        expect(res.body.length).toEqual(20)
      })

      it('returns the subclass levels as well', async () => {
        const indexRes = await request(app).get('/api/2014/classes')
        const index = indexRes.body.results[1].index
        const classRes = await request(app).get(`/api/2014/classes/${index}`)
        const subclass = classRes.body.subclasses[0].index
        const res = await request(app).get(`/api/2014/classes/${index}/levels?subclass=${subclass}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).not.toEqual(0)
        expect(res.body.length).toBeGreaterThan(20)
      })

      describe('/api/2014/classes/:index/levels/:level', () => {
        it('returns objects', async () => {
          const indexRes = await request(app).get('/api/2014/classes')
          const index = indexRes.body.results[1].index
          const level = 1
          const res = await request(app).get(`/api/2014/classes/${index}/levels/${level}`)
          expect(res.statusCode).toEqual(200)
          expect(res.body.level).toEqual(level)
        })
      })

      describe('/api/2014/classes/:index/levels/:level/spells', () => {
        it('returns objects', async () => {
          const index = 'wizard'
          const level = 1
          const res = await request(app).get(`/api/2014/classes/${index}/levels/${level}/spells`)
          expect(res.statusCode).toEqual(200)
          expect(res.body.results.length).not.toEqual(0)
        })
      })

      describe('/api/2014/classes/:index/levels/:level/features', () => {
        it('returns objects', async () => {
          const indexRes = await request(app).get('/api/2014/classes')
          const index = indexRes.body.results[1].index
          const level = 1
          const res = await request(app).get(`/api/2014/classes/${index}/levels/${level}/spells`)
          expect(res.statusCode).toEqual(200)
          expect(res.body.results.length).not.toEqual(0)
        })
      })
    })
  })
})
