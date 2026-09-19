import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

// Import specific functions from the correct controller file
import * as RuleController from '@/controllers/api/2014/ruleController'
import RuleModel from '@/models/2014/rule'
import Translation2014Model from '@/models/2014/translation'
import { ruleFactory } from '@/tests/factories/2014/rule.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('rule')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(RuleModel)
setupModelCleanup(Translation2014Model)

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

    it('returns translated fields and Content-Language header when a translation exists', async () => {
      const ruleData = ruleFactory.build({ index: 'combat', name: 'Combat' })
      await RuleModel.insertMany([ruleData])
      await Translation2014Model.insertMany([
        {
          source_index: 'combat',
          source_collection: 'rules',
          lang: 'fr-FR',
          fields: { name: 'Combat (fr)' },
          completeness: 1.0,
          updated_at: new Date().toISOString()
        }
      ])

      const request = createRequest({ params: { index: 'combat' } })
      request.lang = 'fr-FR'
      const response = createResponse()

      await RuleController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.name).toBe('Combat (fr)')
      expect(response.getHeader('Content-Language')).toBe('fr-FR')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns original content and Content-Language: en when no translation exists for lang', async () => {
      const ruleData = ruleFactory.build({ index: 'combat', name: 'Combat' })
      await RuleModel.insertMany([ruleData])

      const request = createRequest({ params: { index: 'combat' } })
      request.lang = 'de-DE'
      const response = createResponse()

      await RuleController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.name).toBe('Combat')
      expect(response.getHeader('Content-Language')).toBe('en')
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('index (translation)', () => {
    it('returns translated names and Content-Language header when translations exist', async () => {
      const ruleData = ruleFactory.build({ index: 'combat', name: 'Combat' })
      await RuleModel.insertMany([ruleData])
      await Translation2014Model.insertMany([
        {
          source_index: 'combat',
          source_collection: 'rules',
          lang: 'fr-FR',
          fields: { name: 'Combat (fr)' },
          completeness: 1.0,
          updated_at: new Date().toISOString()
        }
      ])

      const request = createRequest({ query: {} })
      request.lang = 'fr-FR'
      const response = createResponse()

      await RuleController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.results[0].name).toBe('Combat (fr)')
      expect(response.getHeader('Content-Language')).toBe('fr-FR')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns Content-Language: en when no translations exist for lang', async () => {
      const rulesData = ruleFactory.buildList(2)
      await RuleModel.insertMany(rulesData)

      const request = createRequest({ query: {} })
      request.lang = 'de-DE'
      const response = createResponse()

      await RuleController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response.getHeader('Content-Language')).toBe('en')
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
