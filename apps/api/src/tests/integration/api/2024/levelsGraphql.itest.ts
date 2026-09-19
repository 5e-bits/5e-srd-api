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

describe('/graphql/2024 levels', () => {
  it('lists levels filtered by class', async () => {
    const res = await request(server)
      .post('/graphql/2024')
      .send({
        query: `
          query {
            levels(class: ["barbarian"], limit: 5) {
              index
              level
              class { index }
            }
          }
        `
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.levels.length).toBeGreaterThan(0)
    for (const level of res.body.data.levels) {
      expect(level.class.index).toEqual('barbarian')
    }
  })

  it('gets a single level by index', async () => {
    const res = await request(server).post('/graphql/2024').send({
      query: `
        query {
          level(index: "barbarian-3") {
            index
            level
            features { index }
          }
        }
      `
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.level).toMatchObject({ index: 'barbarian-3', level: 3 })
  })

  it('returns null for an unknown level index', async () => {
    const res = await request(server).post('/graphql/2024').send({
      query: `
        query {
          level(index: "not-a-real-level") {
            index
          }
        }
      `
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.level).toBeNull()
  })
})
