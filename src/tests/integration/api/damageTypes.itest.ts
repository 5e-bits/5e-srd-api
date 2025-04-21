import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/damage-types', () => {
  it('redirects to /api/2014/damage-types', async () => {
    await request(app)
      .get('/api/damage-types')
      .expect(301)
      .expect('Location', '/api/2014/damage-types')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Acid'
    await request(app)
      .get(`/api/damage-types?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/damage-types?name=${name}`)
  })

  it('redirects to /api/2014/damage-types/{index}', async () => {
    const index = 'cold'
    await request(app)
      .get(`/api/damage-types/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/damage-types/${index}`)
  })
})
