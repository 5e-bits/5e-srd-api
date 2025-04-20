import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location

import RuleSectionModel from '@/models/2014/ruleSection' // Use Model suffix
import * as RuleSectionController from '@/controllers/api/2014/ruleSectionController'
import { ruleSectionFactory } from '@/test/factories/2014/ruleSection.factory' // Import the new factory

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
  await RuleSectionModel.deleteMany({})
})

describe('RuleSectionController', () => {
  describe('index', () => {
    it('returns a list of rule sections', async () => {
      // Arrange
      const ruleSectionsData = ruleSectionFactory.buildList(3)
      const ruleSectionDocs = ruleSectionsData.map((data) => new RuleSectionModel(data))
      await RuleSectionModel.insertMany(ruleSectionDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await RuleSectionController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: ruleSectionsData[0].index,
            name: ruleSectionsData[0].name
          }),
          expect.objectContaining({
            index: ruleSectionsData[1].index,
            name: ruleSectionsData[1].name
          }),
          expect.objectContaining({
            index: ruleSectionsData[2].index,
            name: ruleSectionsData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no rule sections exist', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await RuleSectionController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single rule section when found', async () => {
      // Arrange
      const ruleSectionData = ruleSectionFactory.build({ index: 'cover', name: 'Cover' })
      await RuleSectionModel.insertMany([ruleSectionData]) // Use insertMany workaround

      const request = createRequest({ params: { index: 'cover' } })
      const response = createResponse()

      // Act
      await RuleSectionController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('cover')
      expect(responseData.name).toBe('Cover')
      expect(responseData.desc).toEqual(ruleSectionData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the rule section is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await RuleSectionController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
