import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '@/tests/integration/globalSetup'

afterEach(() => {
  vi.clearAllMocks()
})

describe('/', () => {
  it('should load the page', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(200)
  })
})

describe('/docs', () => {
  it('should redirect', async () => {
    const res = await request(app).get('/docs')
    expect(res.statusCode).toEqual(302)
  })
})

describe('/bad-url', () => {
  it('404s', async () => {
    const res = await request(app).get('/bad-url')
    expect(res.statusCode).toEqual(404)
  })
})

describe('/api', () => {
  it('should redirect to /api/2014', async () => {
    await request(app).get('/api').expect(301).expect('Location', '/api/2014/')
  })
})

describe('/api/2014', () => {
  it('should list the endpoints', async () => {
    const res = await request(app).get('/api/2014')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('ability-scores')
    expect(res.body).not.toHaveProperty('levels')
  })
})
