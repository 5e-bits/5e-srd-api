import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/equipment', () => {
  it('redirects to /api/2014/equipment', async () => {
    await request(app).get('/api/equipment').expect(301).expect('Location', '/api/2014/equipment')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'Abacus'
    await request(app)
      .get(`/api/equipment?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment?name=${name}`)
  })

  it('redirects to /api/2014/equipment/{index}', async () => {
    const index = 'acid-vial'
    await request(app)
      .get(`/api/equipment/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment/${index}`)
  })
})
