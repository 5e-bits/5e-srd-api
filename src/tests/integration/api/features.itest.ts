import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/features', () => {
  it('redirects to /api/2014/features', async () => {
    await request(app).get('/api/features').expect(301).expect('Location', '/api/2014/features')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Action%20Surge'
    await request(app)
      .get(`/api/features?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/features?name=${name}`)
  })

  it('redirects to /api/2014/features/{index}', async () => {
    const index = 'arcane-recovery'
    await request(app)
      .get(`/api/features/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/features/${index}`)
  })
})
