import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/races', () => {
  it('redirects to /api/2014/races', async () => {
    await request(app).get('/api/races').expect(301).expect('Location', '/api/2014/races')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Dragonborn'
    await request(app)
      .get(`/api/races?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/races?name=${name}`)
  })

  it('redirects to /api/2014/races/{index}', async () => {
    const index = 'dwarf'
    await request(app)
      .get(`/api/races/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/races/${index}`)
  })
})
