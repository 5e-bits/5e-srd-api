import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/weapon-properties', () => {
  it('redirects to /api/2014/weapon-properties', async () => {
    await request(app)
      .get('/api/weapon-properties')
      .expect(301)
      .expect('Location', '/api/2014/weapon-properties')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Ammunition'
    await request(app)
      .get(`/api/weapon-properties?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/weapon-properties?name=${name}`)
  })

  it('redirects to /api/2014/weapon-properties/{index}', async () => {
    const index = 'finesse'
    await request(app)
      .get(`/api/weapon-properties/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/weapon-properties/${index}`)
  })
})
