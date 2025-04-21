import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/subclasses', () => {
  it('redirects to /api/2014/subclasses', async () => {
    await request(app).get('/api/subclasses').expect(301).expect('Location', '/api/2014/subclasses')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Berserker'
    await request(app)
      .get(`/api/subclasses?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/subclasses?name=${name}`)
  })

  it('redirects to /api/2014/subclasses/{index}', async () => {
    const index = 'Champion'
    await request(app)
      .get(`/api/subclasses/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/subclasses/${index}`)
  })
})
