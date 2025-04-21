import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/classes', () => {
  it('redirects to /api/2014/classes', async () => {
    await request(app).get('/api/classes').expect(301).expect('Location', '/api/2014/classes')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Cleric'
    await request(app)
      .get(`/api/classes?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/classes?name=${name}`)
  })

  it('redirects to /api/2014/classes/{index}', async () => {
    const index = 'bard'
    await request(app)
      .get(`/api/classes/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/classes/${index}`)
  })
})
