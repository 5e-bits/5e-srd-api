import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SubclassController from '@/controllers/api/2024/subclassController'
import Feature2024Model from '@/models/2024/feature'
import Level2024Model from '@/models/2024/level'
import SubclassModel from '@/models/2024/subclass'
import { featureFactory } from '@/tests/factories/2024/feature.factory'
import { levelFactory } from '@/tests/factories/2024/level.factory'
import { subclassFactory } from '@/tests/factories/2024/subclass.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('subclass')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(SubclassModel)
setupModelCleanup(Level2024Model)
setupModelCleanup(Feature2024Model)

describe('SubclassController', () => {
  describe('index', () => {
    it('returns a list of subclasses', async () => {
      const subclassesData = subclassFactory.buildList(3)
      await SubclassModel.insertMany(subclassesData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await SubclassController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const subclassesData = [
        subclassFactory.build({ name: 'Path of the Berserker' }),
        subclassFactory.build({ name: 'Path of the Totem Warrior' })
      ]
      await SubclassModel.insertMany(subclassesData)

      const request = createRequest({ query: { name: 'Berserker' } })
      const response = createResponse()

      await SubclassController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Path of the Berserker')
    })
  })

  describe('show', () => {
    it('returns a single subclass when found', async () => {
      const subclassData = subclassFactory.build({
        index: 'berserker',
        name: 'Path of the Berserker'
      })
      await SubclassModel.insertMany([subclassData])

      const request = createRequest({ params: { index: 'berserker' } })
      const response = createResponse()

      await SubclassController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('berserker')
      expect(responseData.name).toBe('Path of the Berserker')
      expect(responseData.features).toHaveLength(2)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the subclass is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await SubclassController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })

  describe('showLevelsForSubclass', () => {
    const subclassIndex = 'path-of-the-berserker'
    const subclassUrl = `/api/2024/subclasses/${subclassIndex}`

    it('returns levels for a specific subclass', async () => {
      const levelsData = levelFactory.buildList(3, {
        subclass: { index: subclassIndex, name: 'Path of the Berserker', url: subclassUrl }
      })
      await Level2024Model.insertMany(levelsData)
      await Level2024Model.insertMany(levelFactory.buildList(2))

      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()

      await SubclassController.showLevelsForSubclass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if the subclass has no levels', async () => {
      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()

      await SubclassController.showLevelsForSubclass(request, response, mockNext)

      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
    })

    it('handles database errors', async () => {
      const request = createRequest({ params: { index: subclassIndex } })
      const response = createResponse()
      const error = new Error('Level find failed')
      vi.spyOn(Level2024Model, 'find').mockImplementationOnce(
        () => ({ sort: vi.fn().mockRejectedValueOnce(error) }) as any
      )

      await SubclassController.showLevelsForSubclass(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showLevelForSubclass', () => {
    const subclassIndex = 'path-of-the-berserker'
    const subclassUrl = `/api/2024/subclasses/${subclassIndex}`
    const targetLevel = 3

    it('returns a specific level for a subclass', async () => {
      const levelData = levelFactory.build({
        level: targetLevel,
        subclass: { index: subclassIndex, name: 'Path of the Berserker', url: subclassUrl }
      })
      await Level2024Model.insertMany([levelData])

      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()

      await SubclassController.showLevelForSubclass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toMatchObject({ level: targetLevel, index: levelData.index })
    })

    it('calls next() when the level is not found', async () => {
      const request = createRequest({ params: { index: subclassIndex, level: '10' } })
      const response = createResponse()

      await SubclassController.showLevelForSubclass(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles database errors', async () => {
      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()
      const error = new Error('Level findOne failed')
      vi.spyOn(Level2024Model, 'findOne').mockRejectedValueOnce(error)

      await SubclassController.showLevelForSubclass(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showFeaturesForSubclassAndLevel', () => {
    const subclassIndex = 'path-of-the-berserker'
    const subclassUrl = `/api/2024/subclasses/${subclassIndex}`
    const targetLevel = 3

    it('returns features gained at a specific subclass level', async () => {
      const matchingFeature = featureFactory.build({
        subclass: { index: subclassIndex, name: 'Path of the Berserker', url: subclassUrl },
        level: {
          index: `barbarian-${targetLevel}`,
          name: `Barbarian ${targetLevel}`,
          url: `/api/2024/classes/barbarian/levels/${targetLevel}`
        }
      })
      const otherFeature = featureFactory.build({
        subclass: { index: subclassIndex, name: 'Path of the Berserker', url: subclassUrl },
        level: {
          index: 'barbarian-6',
          name: 'Barbarian 6',
          url: '/api/2024/classes/barbarian/levels/6'
        }
      })
      await Feature2024Model.insertMany([matchingFeature, otherFeature])

      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()

      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].index).toBe(matchingFeature.index)
    })

    it('handles database errors', async () => {
      const request = createRequest({
        params: { index: subclassIndex, level: String(targetLevel) }
      })
      const response = createResponse()
      const error = new Error('Feature find failed')
      vi.spyOn(Feature2024Model, 'find').mockImplementationOnce(
        () => ({ select: vi.fn().mockReturnThis(), sort: vi.fn().mockRejectedValueOnce(error) }) as any
      )

      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
