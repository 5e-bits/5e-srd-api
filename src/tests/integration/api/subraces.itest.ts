import { describe, it, afterEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../globalSetup' // Adjusted path for relative import

afterEach(() => {
  vi.clearAllMocks()
})

describe('/api/subraces', () => {
  it('redirects to /api/2014/subraces', async () => {
    await request(app).get('/api/subraces').expect(301).expect('Location', '/api/2014/subraces')
  })

  it('redirects preserving query parameters', async () => {
    const name = 'High%20Elf'
    await request(app)
      .get(`/api/subraces?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/subraces?name=${name}`)
  })

  it('redirects to /api/2014/subraces/{index}', async () => {
    const index = 'hill-dwarf'
    await request(app)
      .get(`/api/subraces/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/subraces/${index}`)
  })
})
