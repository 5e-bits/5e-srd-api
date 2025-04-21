import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/rule-sections', () => {
  it('redirects to /api/2014/rule-sections', async () => {
    await request(app)
      .get('/api/rule-sections')
      .expect(301)
      .expect('Location', '/api/2014/rule-sections')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Ability%20Checks'
    await request(app)
      .get(`/api/rule-sections?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/rule-sections?name=${name}`)
  })

  it('redirects to /api/2014/rule-sections/{index}', async () => {
    const index = 'actions-in-combat'
    await request(app)
      .get(`/api/rule-sections/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/rule-sections/${index}`)
  })
})
