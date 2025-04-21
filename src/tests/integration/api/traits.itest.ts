import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/traits', () => {
  it('redirects to /api/2014/traits', async () => {
    await request(app).get('/api/traits').expect(301).expect('Location', '/api/2014/traits')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Brave'
    await request(app)
      .get(`/api/traits?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/traits?name=${name}`)
  })

  it('redirects to /api/2014/traits/{index}', async () => {
    const index = 'darkvision'
    await request(app)
      .get(`/api/traits/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/traits/${index}`)
  })
})
