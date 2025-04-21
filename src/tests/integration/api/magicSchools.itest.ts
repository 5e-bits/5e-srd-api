import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/magic-schools', () => {
  it('redirects to /api/2014/magic-schools', async () => {
    await request(app)
      .get('/api/magic-schools')
      .expect(301)
      .expect('Location', '/api/2014/magic-schools')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Abjuration'
    await request(app)
      .get(`/api/magic-schools?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-schools?name=${name}`)
  })

  it('redirects to /api/2014/magic-schools/{index}', async () => {
    const index = 'conjuration'
    await request(app)
      .get(`/api/magic-schools/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-schools/${index}`)
  })
})
