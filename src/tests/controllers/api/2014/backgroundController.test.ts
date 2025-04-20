import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support'

import BackgroundModel from '@/models/2014/background'
import BackgroundController from '@/controllers/api/2014/backgroundController'
import { backgroundFactory } from '@/tests/factories/2014/background.factory'

const mockNext = vi.fn(defaultMockNext)

beforeAll(async () => {
  const mongoUri = process.env.TEST_MONGODB_URI
  if (!mongoUri) {
    throw new Error('TEST_MONGODB_URI environment variable not set.')
  }
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  vi.clearAllMocks()
  await BackgroundModel.deleteMany({})
})

describe('BackgroundController', () => {
  describe('index', () => {
    it('returns a list of backgrounds', async () => {
      const backgroundsData = backgroundFactory.buildList(3)
      const backgroundDocs = backgroundsData.map((data) => new BackgroundModel(data))
      await BackgroundModel.insertMany(backgroundDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await BackgroundController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: backgroundsData[0].index,
            name: backgroundsData[0].name
          }),
          expect.objectContaining({
            index: backgroundsData[1].index,
            name: backgroundsData[1].name
          }),
          expect.objectContaining({
            index: backgroundsData[2].index,
            name: backgroundsData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no backgrounds exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await BackgroundController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single background when found', async () => {
      const backgroundData = backgroundFactory.build({ index: 'acolyte', name: 'Acolyte' })
      await BackgroundModel.insertMany([backgroundData])

      const request = createRequest({ params: { index: 'acolyte' } })
      const response = createResponse()

      await BackgroundController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('acolyte')
      expect(responseData.name).toBe('Acolyte')
      // Add more specific checks if needed, e.g., for nested properties
      expect(responseData.feature.name).toEqual(backgroundData.feature.name)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the background is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await BackgroundController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
