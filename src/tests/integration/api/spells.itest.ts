import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/spells', () => {
  it('redirects to /api/2014/spells', async () => {
    await request(app).get('/api/spells').expect(301).expect('Location', '/api/2014/spells')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Acid%20Arrow'
    await request(app)
      .get(`/api/spells?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/spells?name=${name}`)
  })

  it('redirects to /api/2014/spells/{index}', async () => {
    const index = 'aid'
    await request(app)
      .get(`/api/spells/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/spells/${index}`)
  })
})
