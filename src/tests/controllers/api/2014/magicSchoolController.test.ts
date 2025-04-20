import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location

import MagicSchoolModel from '@/models/2014/magicSchool' // Use Model suffix
import MagicSchoolController from '@/controllers/api/2014/magicSchoolController'
import { magicSchoolFactory } from '@/test/factories/2014/magicSchool.factory' // Import the new factory

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
  await MagicSchoolModel.deleteMany({})
})

describe('MagicSchoolController', () => {
  describe('index', () => {
    it('returns a list of magic schools', async () => {
      // Arrange
      const magicSchoolsData = magicSchoolFactory.buildList(3)
      const magicSchoolDocs = magicSchoolsData.map((data) => new MagicSchoolModel(data))
      await MagicSchoolModel.insertMany(magicSchoolDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await MagicSchoolController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: magicSchoolsData[0].index,
            name: magicSchoolsData[0].name
          }),
          expect.objectContaining({
            index: magicSchoolsData[1].index,
            name: magicSchoolsData[1].name
          }),
          expect.objectContaining({
            index: magicSchoolsData[2].index,
            name: magicSchoolsData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no magic schools exist', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await MagicSchoolController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single magic school when found', async () => {
      // Arrange
      const magicSchoolData = magicSchoolFactory.build({ index: 'evocation', name: 'Evocation' })
      await MagicSchoolModel.insertMany([magicSchoolData]) // Use insertMany workaround

      const request = createRequest({ params: { index: 'evocation' } })
      const response = createResponse()

      // Act
      await MagicSchoolController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('evocation')
      expect(responseData.name).toBe('Evocation')
      expect(responseData.desc).toEqual(magicSchoolData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the magic school is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await MagicSchoolController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
