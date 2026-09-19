import { Application } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import createApp from '@/server'
import { mongodbUri, redisClient } from '@/util'

let app: Application
let server: any

afterEach(() => {
  vi.clearAllMocks()
})

beforeAll(async () => {
  await mongoose.connect(mongodbUri)
  await redisClient.connect()
  app = await createApp()
  server = app.listen()
})

afterAll(async () => {
  await mongoose.disconnect()
  await redisClient.quit()
  server.close()
})

describe('/graphql/2024 spells', () => {
  it('lists spells filtered by class', async () => {
    const res = await request(app)
      .post('/graphql/2024')
      .send({
        query: `
          query {
            spells(class: ["wizard"], limit: 5) {
              index
              level
              school { index }
              classes { index }
            }
          }
        `
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.spells.length).toBeGreaterThan(0)
    for (const spell of res.body.data.spells) {
      expect(spell.classes.map((c: { index: string }) => c.index)).toContain('wizard')
    }
  })

  it('gets a single spell by index', async () => {
    const res = await request(app).post('/graphql/2024').send({
      query: `
        query {
          spell(index: "acid-arrow") {
            index
            name
            damage {
              damage_type { index }
              damage_at_slot_level { level value }
            }
          }
        }
      `
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.spell).toMatchObject({ index: 'acid-arrow' })
  })

  it('returns null for an unknown spell index', async () => {
    const res = await request(app).post('/graphql/2024').send({
      query: `
        query {
          spell(index: "not-a-real-spell") {
            index
          }
        }
      `
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.spell).toBeNull()
  })
})
