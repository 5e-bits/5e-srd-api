import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support'

import RuleModel from '@/models/2014/rule' // Use Model suffix
// Import specific functions from the correct controller file
import * as RuleController from '@/controllers/api/2014/ruleController'
import { ruleFactory } from '@/tests/factories/2014/rule.factory' // Updated path

const mockNext = vi.fn(defaultMockNext)

const fileUniqueDbUri = `${process.env.TEST_MONGODB_URI_BASE}test_rule_${crypto.randomBytes(4).toString('hex')}`

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
  await RuleModel.deleteMany({})
})

describe('RuleController', () => {
  // Updated describe block name
  describe('index', () => {
    it('returns a list of rules', async () => {
      // Arrange
      const rulesData = ruleFactory.buildList(3)
      const ruleDocs = rulesData.map((data) => new RuleModel(data))
      await RuleModel.insertMany(ruleDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await RuleController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: rulesData[0].index, name: rulesData[0].name }),
          expect.objectContaining({ index: rulesData[1].index, name: rulesData[1].name }),
          expect.objectContaining({ index: rulesData[2].index, name: rulesData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no rules exist', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await RuleController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single rule when found', async () => {
      // Arrange
      const ruleData = ruleFactory.build({ index: 'combat', name: 'Combat' })
      await RuleModel.insertMany([ruleData]) // Use insertMany workaround

      const request = createRequest({ params: { index: 'combat' } })
      const response = createResponse()

      // Act
      await RuleController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('combat')
      expect(responseData.name).toBe('Combat')
      expect(responseData.desc).toEqual(ruleData.desc)
      expect(responseData.subsections).toHaveLength(ruleData.subsections.length)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the rule is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await RuleController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
