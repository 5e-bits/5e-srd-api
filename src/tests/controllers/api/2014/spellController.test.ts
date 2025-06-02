import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SpellController from '@/controllers/api/2014/spellController'
import SpellModel from '@/models/2014/spell'
import { spellFactory } from '@/tests/factories/2014/spell.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
// Import the DB helper functions
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('spell')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(SpellModel)

describe('SpellController', () => {
  describe('index', () => {
    it('returns a list of spells', async () => {
      // Arrange
      const spellsData = spellFactory.buildList(3)
      // Use insertMany directly
      await SpellModel.insertMany(spellsData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await SpellController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: spellsData[0].index, name: spellsData[0].name }),
          expect.objectContaining({ index: spellsData[1].index, name: spellsData[1].name }),
          expect.objectContaining({ index: spellsData[2].index, name: spellsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // Filters test remains the same
    it('filters spells by level', async () => {
      const spellsData = [
        spellFactory.build({ level: 1, name: 'Spell A' }),
        spellFactory.build({ level: 2, name: 'Spell B' }),
        spellFactory.build({ level: 1, name: 'Spell C' })
      ]
      await SpellModel.insertMany(spellsData)

      const request = createRequest({ query: { level: '1' } })
      const response = createResponse()

      await SpellController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(responseData.results.map((r: any) => r.index)).toEqual(
        expect.arrayContaining([spellsData[0].index, spellsData[2].index])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no spells exist', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await SpellController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single spell when found', async () => {
      // Arrange
      const spellData = spellFactory.build({ index: 'fireball', name: 'Fireball' })
      await SpellModel.insertMany([spellData])

      const request = createRequest({ params: { index: 'fireball' } })
      const response = createResponse()

      // Act
      await SpellController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('fireball')
      expect(responseData.name).toBe('Fireball')
      expect(responseData.desc).toEqual(spellData.desc)
      expect(responseData.level).toEqual(spellData.level)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the spell is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await SpellController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
