import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location

import RuleSectionModel from '@/models/2014/ruleSection' // Use Model suffix
import * as RuleSectionController from '@/controllers/api/2014/ruleSectionController'
import { ruleSectionFactory } from '@/tests/factories/2014/ruleSection.factory' // Updated path

const mockNext = vi.fn(defaultMockNext)

// Apply DB isolation pattern
const fileUniqueDbUri = `${process.env.TEST_MONGODB_URI_BASE}test_rulesection_${crypto.randomBytes(4).toString('hex')}`

describe('RuleSectionController', () => {
  beforeAll(async () => {
    // Connect to isolated DB
    await mongoose.connect(fileUniqueDbUri)
  })

  afterAll(async () => {
    // Drop and disconnect isolated DB
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    // Clean the relevant model before each test
    await RuleSectionModel.deleteMany({})
  })

  describe('index', () => {
    it('returns a list of rule sections', async () => {
      // Arrange
      const ruleSectionsData = ruleSectionFactory.buildList(3)
      await RuleSectionModel.insertMany(ruleSectionsData)
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
      const request = createRequest({ query: {} })
      const response = createResponse()

      await RuleSectionController.index(request, response, mockNext)

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
      const ruleSectionData = ruleSectionFactory.build({
        index: 'adventuring',
        name: 'Adventuring'
      })
      await RuleSectionModel.insertMany([ruleSectionData])
      const request = createRequest({ params: { index: 'adventuring' } })
      const response = createResponse()

      // Act
      await RuleSectionController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('adventuring')
      expect(responseData.name).toBe('Adventuring')
      expect(responseData.desc).toEqual(ruleSectionData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the rule section is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await RuleSectionController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200) // Passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Default 404 handling
    })
  })
})
