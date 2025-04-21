import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/proficiencies', () => {
  it('redirects to /api/2014/proficiencies', async () => {
    await request(app)
      .get('/api/proficiencies')
      .expect(301)
      .expect('Location', '/api/2014/proficiencies')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Bagpipes'
    await request(app)
      .get(`/api/proficiencies?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/proficiencies?name=${name}`)
  })

  it('redirects to /api/2014/proficiencies/{index}', async () => {
    const index = 'blowguns'
    await request(app)
      .get(`/api/proficiencies/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/proficiencies/${index}`)
  })
})
