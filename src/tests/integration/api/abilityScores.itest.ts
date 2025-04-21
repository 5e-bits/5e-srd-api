import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/ability-scores', () => {
  it('redirects to /api/2014/ability-scores', async () => {
    await request(app)
      .get('/api/ability-scores')
      .expect(301)
      .expect('Location', '/api/2014/ability-scores')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'CHA'
    await request(app)
      .get(`/api/ability-scores?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/ability-scores?name=${name}`)
  })

  it('redirects to /api/2014/ability-scores/{index}', async () => {
    const index = 'strength'
    await request(app)
      .get(`/api/ability-scores/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/ability-scores/${index}`)
  })
})
