import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/magic-items', () => {
  it('redirects to /api/2014/magic-items', async () => {
    await request(app)
      .get('/api/magic-items')
      .expect(301)
      .expect('Location', '/api/2014/magic-items')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Adamantine%20Armor'
    await request(app)
      .get(`/api/magic-items?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-items?name=${name}`)
  })

  it('redirects to /api/2014/magic-items/{index}', async () => {
    const index = 'ammunition'
    await request(app)
      .get(`/api/magic-items/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-items/${index}`)
  })
})
