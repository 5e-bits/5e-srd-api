import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/equipment-categories', () => {
  it('redirects to /api/2014/equipment-categories', async () => {
    await request(app)
      .get('/api/equipment-categories')
      .expect(301)
      .expect('Location', '/api/2014/equipment-categories')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Adventuring%20Gear'
    await request(app)
      .get(`/api/equipment-categories?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment-categories?name=${name}`)
  })

  it('redirects to /api/2014/equipment-categories/{index}', async () => {
    const index = 'ammunition'
    await request(app)
      .get(`/api/equipment-categories/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment-categories/${index}`)
  })
})
