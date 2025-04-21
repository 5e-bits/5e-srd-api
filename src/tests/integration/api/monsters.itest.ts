import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/monsters', () => {
  it('redirects to /api/2014/monsters', async () => {
    await request(app).get('/api/monsters').expect(301).expect('Location', '/api/2014/monsters')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Aboleth'
    await request(app)
      .get(`/api/monsters?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/monsters?name=${name}`)
  })

  it('redirects to /api/2014/monsters/{index}', async () => {
    const index = 'acolyte'
    await request(app)
      .get(`/api/monsters/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/monsters/${index}`)
  })
})
