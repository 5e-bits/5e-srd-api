import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/conditions', () => {
  it('redirects to /api/2014/conditions', async () => {
    await request(app).get('/api/conditions').expect(301).expect('Location', '/api/2014/conditions')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Blinded'
    await request(app)
      .get(`/api/conditions?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/conditions?name=${name}`)
  })

  it('redirects to /api/2014/conditions/{index}', async () => {
    const index = 'charmed'
    await request(app)
      .get(`/api/conditions/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/conditions/${index}`)
  })
})
