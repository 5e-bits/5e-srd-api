import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks() // Assuming it was jest.clearAllMocks()
})

describe('/api/skills', () => {
  it('redirects to /api/2014/skills', async () => {
    await request(app).get('/api/skills').expect(301).expect('Location', '/api/2014/skills')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Acrobatics'
    await request(app)
      .get(`/api/skills?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/skills?name=${name}`)
  })

  it('redirects to /api/2014/skills/{index}', async () => {
    const index = 'arcana'
    await request(app)
      .get(`/api/skills/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/skills/${index}`)
  })
})
