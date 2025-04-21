import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto' // For generating unique DB names
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support'

import SpellModel from '@/models/2014/spell' // Use Model suffix
// Remove imports for models not cleaned here
// import ClassModel from '@/models/2014/class'
// import FeatureModel from '@/models/2014/feature'
// import LevelModel from '@/models/2014/level'
// import ProficiencyModel from '@/models/2014/proficiency'
// import SubclassModel from '@/models/2014/subclass'
// Import specific functions from the controller
import * as SpellController from '@/controllers/api/2014/spellController'
import { spellFactory } from '@/tests/factories/2014/spell.factory' // Updated path

const mockNext = vi.fn(defaultMockNext)

// Hold the unique connection details for this test file
let fileUniqueDbUri: string | undefined

beforeAll(async () => {
  const baseUri = process.env.TEST_MONGODB_URI_BASE
  if (!baseUri) {
    throw new Error('TEST_MONGODB_URI_BASE environment variable not set. Ensure globalSetup ran.')
  }
  // Create a unique DB name for this file
  const dbName = `test_spell_${crypto.randomBytes(4).toString('hex')}`
  fileUniqueDbUri = baseUri + dbName

  // Connect mongoose to the unique DB for this file
  await mongoose.connect(fileUniqueDbUri)
  // console.log(`[${dbName}] Connected to unique DB: ${fileUniqueDbUri}`);
})

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    // Drop the unique database for this file
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase()
        // console.log(`[${mongoose.connection.name}] Dropped unique DB.`);
      }
    } catch (err) {
      console.error(`Error dropping database ${mongoose.connection.name}:`, err)
    }
    // Disconnect the connection specific to this file
    await mongoose.disconnect()
    // console.log(`[${mongoose.connection.name}] Disconnected.`);
  }
})

beforeEach(async () => {
  vi.clearAllMocks()
  // Clear SpellModel before each test within this file's unique DB
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
