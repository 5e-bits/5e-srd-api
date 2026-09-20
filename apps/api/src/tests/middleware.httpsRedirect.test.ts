import express from 'express'
import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'

import httpsRedirect from '@/middleware/httpsRedirect'

const buildApp = () => {
  const app = express()
  app.set('trust proxy', 1)
  app.use(httpsRedirect)
  app.get('/api/2014/classes', (_req, res) => {
    res.json({ ok: true })
  })
  return app
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('httpsRedirect', () => {
  it('redirects http to https in production, preserving path and query', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const res = await request(buildApp())
      .get('/api/2014/classes?name=bard')
      .set('Host', 'www.dnd5eapi.co')
      .set('X-Forwarded-Proto', 'http')
    expect(res.statusCode).toEqual(301)
    expect(res.headers.location).toEqual('https://www.dnd5eapi.co/api/2014/classes?name=bard')
  })

  it('serves https requests with an HSTS header in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const res = await request(buildApp())
      .get('/api/2014/classes')
      .set('X-Forwarded-Proto', 'https')
    expect(res.statusCode).toEqual(200)
    expect(res.headers['strict-transport-security']).toMatch(/^max-age=\d+$/)
  })

  it('does not redirect outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const res = await request(buildApp())
      .get('/api/2014/classes')
      .set('X-Forwarded-Proto', 'http')
    expect(res.statusCode).toEqual(200)
    expect(res.headers['strict-transport-security']).toBeUndefined()
  })
})
