import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SubclassController from '@/controllers/api/2014/subclassController'
import FeatureModel from '@/models/2014/feature'
import LevelModel from '@/models/2014/level'
import SubclassModel from '@/models/2014/subclass'
import { apiReferenceFactory } from '@/tests/factories/2014/common.factory'
import { featureFactory } from '@/tests/factories/2014/feature.factory'
import { levelFactory } from '@/tests/factories/2014/level.factory'
import { subclassFactory } from '@/tests/factories/2014/subclass.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('subclass')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
// Setup cleanup for all relevant models
setupModelCleanup(SubclassModel)
setupModelCleanup(LevelModel)
setupModelCleanup(FeatureModel)

describe('SubclassController', () => {
  describe('index', () => {
    it('returns a list of subclasses', async () => {
      // Arrange
      const subclassesData = subclassFactory.buildList(3)
      await SubclassModel.insertMany(subclassesData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await SubclassController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          // Index returns index, name, url
          expect.objectContaining({
            index: subclassesData[0].index,
            name: subclassesData[0].name,
            url: subclassesData[0].url
          }),
          expect.objectContaining({
            index: subclassesData[1].index,
            name: subclassesData[1].name,
            url: subclassesData[1].url
          }),
          expect.objectContaining({
            index: subclassesData[2].index,
            name: subclassesData[2].name,
            url: subclassesData[2].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during find', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()
      const error = new Error('Database find failed')
      vi.spyOn(SubclassModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockReturnThis(),
          exec: vi.fn().mockRejectedValueOnce(error)
        } as any
        return query
      })

      // Act
      await SubclassController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty list when no subclasses exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()
      await SubclassController.index(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single subclass when found', async () => {
      // Arrange
      const subclassData = subclassFactory.build({ index: 'berserker' })
      await SubclassModel.insertMany([subclassData])
      const request = createRequest({ params: { index: 'berserker' } })
      const response = createResponse()

      // Act
      await SubclassController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toMatchObject({
        index: subclassData.index,
        name: subclassData.name,
        url: subclassData.url
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the subclass is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()
      await SubclassController.show(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles database errors during findOne', async () => {
      const request = createRequest({ params: { index: 'berserker' } })
      const response = createResponse()
      const error = new Error('Database findOne failed')
      vi.spyOn(SubclassModel, 'findOne').mockRejectedValueOnce(error)
      await SubclassController.show(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showLevelsForSubclass', () => {
    const subclassIndex = 'berserker'
    const subclassUrl = `/api/2014/subclasses/${subclassIndex}`
    it('returns levels for a specific subclass', async () => {
      // Arrange
      const subclassData = subclassFactory.build({ index: subclassIndex, url: subclassUrl })
      await SubclassModel.insertMany([subclassData])
      // Create levels specifically linked to this subclass
      const levelsData = levelFactory.buildList(3, {
        subclass: { index: subclassIndex, name: subclassData.name, url: subclassUrl }
      })
      await LevelModel.insertMany(levelsData)
      // Add some unrelated levels to ensure filtering works
      await LevelModel.insertMany(levelFactory.buildList(2))

      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()

      // Act
      await SubclassController.showLevelsForSubclass(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toBeInstanceOf(Array)
      expect(responseData).toHaveLength(3) // Only the 3 levels for this subclass
      // Check if the returned levels match the ones created for the subclass
      expect(responseData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: levelsData[0].index,
            level: levelsData[0].level,
            url: levelsData[0].url
          }),
          expect.objectContaining({
            index: levelsData[1].index,
            level: levelsData[1].level,
            url: levelsData[1].url
          }),
          expect.objectContaining({
            index: levelsData[2].index,
            level: levelsData[2].level,
            url: levelsData[2].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty array if subclass exists but has no levels', async () => {
      const subclassData = subclassFactory.build({ index: subclassIndex })
      await SubclassModel.insertMany([subclassData])
      // No levels inserted for this subclass
      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()
      await SubclassController.showLevelsForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty array for a non-existent subclass index', async () => {
      const request = createRequest({ params: { index: 'nonexistent-subclass' } })
      const response = createResponse()
      await SubclassController.showLevelsForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during level find', async () => {
      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()
      const error = new Error('Level find failed')
      vi.spyOn(LevelModel, 'find').mockImplementationOnce(
        () =>
          ({
            sort: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await SubclassController.showLevelsForSubclass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showLevelForSubclass', () => {
    const subclassIndex = 'berserker'
    const targetLevel = 5
    const levelUrl = `/api/2014/subclasses/${subclassIndex}/levels/${targetLevel}`

    it('returns a specific level for a subclass', async () => {
      // Arrange
      const subclassData = subclassFactory.build({ index: subclassIndex })
      await SubclassModel.insertMany([subclassData])
      const levelData = levelFactory.build({
        level: targetLevel,
        subclass: {
          index: subclassIndex,
          name: subclassData.name,
          url: `/api/2014/subclasses/${subclassIndex}`
        },
        url: levelUrl
      })
      await LevelModel.insertMany([levelData])

      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()

      // Act
      await SubclassController.showLevelForSubclass(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toMatchObject({
        index: levelData.index,
        level: levelData.level,
        url: levelData.url
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the specific level is not found for the subclass', async () => {
      const request = createRequest({ params: { index: subclassIndex, level: '10' } })
      const response = createResponse()
      await SubclassController.showLevelForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles database errors during level findOne', async () => {
      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()
      const error = new Error('Level findOne failed')
      vi.spyOn(LevelModel, 'findOne').mockRejectedValueOnce(error)
      await SubclassController.showLevelForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns 400 for invalid level parameter (non-numeric)', async () => {
      const request = createRequest({ params: { index: subclassIndex, level: 'invalid' } })
      const response = createResponse()
      await SubclassController.showLevelForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
      expect(mockNext).not.toHaveBeenCalled() // Should not call next on validation error
    })

    it('returns 400 for invalid level parameter (out of range)', async () => {
      const request = createRequest({ params: { index: subclassIndex, level: '0' } }) // Level 0 is invalid
      const response = createResponse()
      await SubclassController.showLevelForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('showFeaturesForSubclass', () => {
    const subclassIndex = 'berserker'
    const subclassUrl = `/api/2014/subclasses/${subclassIndex}`

    it('returns features for a specific subclass', async () => {
      // Arrange
      const subclassData = subclassFactory.build({ index: subclassIndex, url: subclassUrl })
      await SubclassModel.insertMany([subclassData])
      // Create features linked to this subclass
      const subclassRef = apiReferenceFactory.build({
        index: subclassIndex,
        name: subclassData.name,
        url: subclassUrl
      })
      const featuresData = featureFactory.buildList(2, { subclass: subclassRef })
      await FeatureModel.insertMany(featuresData)
      // Add unrelated features
      await FeatureModel.insertMany(featureFactory.buildList(1))

      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()

      // Act
      await SubclassController.showFeaturesForSubclass(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveProperty('count', 2)
      expect(responseData).toHaveProperty('results')
      expect(responseData.results).toBeInstanceOf(Array)
      expect(responseData.results).toHaveLength(2) // Only the 2 features for this subclass
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: featuresData[0].index,
            name: featuresData[0].name,
            url: featuresData[0].url
          }),
          expect.objectContaining({
            index: featuresData[1].index,
            name: featuresData[1].name,
            url: featuresData[1].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list if subclass has no features', async () => {
      const subclassData = subclassFactory.build({ index: subclassIndex })
      await SubclassModel.insertMany([subclassData])
      // No features inserted
      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()
      await SubclassController.showFeaturesForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual({ count: 0, results: [] })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during feature find', async () => {
      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()
      const error = new Error('Feature find failed')
      vi.spyOn(FeatureModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockRejectedValueOnce(error)
        } as any
        return query
      })
      await SubclassController.showFeaturesForSubclass(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showFeaturesForSubclassAndLevel', () => {
    const subclassIndex = 'berserker'
    const targetLevel = 3
    const subclassUrl = `/api/2014/subclasses/${subclassIndex}`

    it('returns features for a specific subclass and level', async () => {
      // Arrange
      const subclassData = subclassFactory.build({ index: subclassIndex, url: subclassUrl })
      await SubclassModel.insertMany([subclassData])
      const subclassRef = apiReferenceFactory.build({
        index: subclassIndex,
        name: subclassData.name,
        url: subclassUrl
      })

      // Features at the target level
      const featuresDataLevel = featureFactory.buildList(2, {
        subclass: subclassRef,
        level: targetLevel
      })
      // Features at a different level
      const featuresDataOtherLevel = featureFactory.buildList(1, {
        subclass: subclassRef,
        level: targetLevel + 1
      })
      await FeatureModel.insertMany([...featuresDataLevel, ...featuresDataOtherLevel])

      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()

      // Act
      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveProperty('count', 2)
      expect(responseData).toHaveProperty('results')
      expect(responseData.results).toBeInstanceOf(Array)
      expect(responseData.results).toHaveLength(2) // Only features at target level
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: featuresDataLevel[0].index,
            name: featuresDataLevel[0].name,
            url: featuresDataLevel[0].url
          }),
          expect.objectContaining({
            index: featuresDataLevel[1].index,
            name: featuresDataLevel[1].name,
            url: featuresDataLevel[1].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list if no features for the specific level', async () => {
      const subclassData = subclassFactory.build({ index: subclassIndex })
      await SubclassModel.insertMany([subclassData])
      // No features at target level inserted
      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()
      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual({ count: 0, results: [] })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during feature find for level', async () => {
      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()
      const error = new Error('Feature find failed')
      vi.spyOn(FeatureModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockRejectedValueOnce(error)
        } as any
        return query
      })
      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns 400 for invalid level parameter (non-numeric)', async () => {
      const request = createRequest({ params: { index: subclassIndex, level: 'invalid' } })
      const response = createResponse()
      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 400 for invalid level parameter (out of range)', async () => {
      const request = createRequest({ params: { index: subclassIndex, level: '21' } })
      const response = createResponse()
      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
