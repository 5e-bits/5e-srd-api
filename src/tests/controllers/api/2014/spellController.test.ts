import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support'

import SpellModel from '@/models/2014/spell' // Use Model suffix
// Import specific functions from the controller
import * as SpellController from '@/controllers/api/2014/spellController'
import { spellFactory } from '@/tests/factories/2014/spell.factory' // Updated path

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
  await SpellModel.deleteMany({})
})

describe('SpellController', () => {
  describe('index', () => {
    it('returns a list of spells', async () => {
      // Arrange
      const spellsData = spellFactory.buildList(3)
      const spellDocs = spellsData.map((data) => new SpellModel(data))
      await SpellModel.insertMany(spellDocs)

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

    // Add tests for query parameters (level, school, name) if desired
    it('filters spells by level', async () => {
      const spellsData = [
        spellFactory.build({ level: 1, name: 'Spell A' }),
        spellFactory.build({ level: 2, name: 'Spell B' }),
        spellFactory.build({ level: 1, name: 'Spell C' })
      ]
      const spellDocs = spellsData.map((data) => new SpellModel(data))
      await SpellModel.insertMany(spellDocs)

      const request = createRequest({ query: { level: '1' } }) // Query for level 1
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
      await SpellModel.insertMany([spellData]) // Use insertMany workaround

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
