import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/rules', () => {
  it('redirects to /api/2014/rules', async () => {
    await request(app).get('/api/rules').expect(301).expect('Location', '/api/2014/rules')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Adventuring'
    await request(app)
      .get(`/api/rules?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/rules?name=${name}`)
  })

  it('redirects to /api/2014/rules/{index}', async () => {
    const index = 'appendix'
    await request(app)
      .get(`/api/rules/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/rules/${index}`)
  })
})
