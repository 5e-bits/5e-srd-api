import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/feats', () => {
  it('redirects to /api/2014/feats', async () => {
    await request(app).get('/api/feats').expect(301).expect('Location', '/api/2014/feats')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Grappler'
    await request(app)
      .get(`/api/feats?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/feats?name=${name}`)
  })

  it('redirects to /api/2014/feats/{index}', async () => {
    const index = 'grappler'
    await request(app)
      .get(`/api/feats/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/feats/${index}`)
  })
})
