import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/languages', () => {
  it('redirects to /api/2014/languages', async () => {
    await request(app).get('/api/languages').expect(301).expect('Location', '/api/2014/languages')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Abyssal'
    await request(app)
      .get(`/api/languages?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/languages?name=${name}`)
  })

  it('redirects to /api/2014/languages/{index}', async () => {
    const index = 'celestial'
    await request(app)
      .get(`/api/languages/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/languages/${index}`)
  })
})
