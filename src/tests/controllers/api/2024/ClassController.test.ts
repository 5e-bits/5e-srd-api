import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as ClassController from '@/controllers/api/2024/classController'
import ClassModel from '@/models/2024/class'
import Feature2024Model from '@/models/2024/feature'
import Level2024Model from '@/models/2024/level'
import { classFactory } from '@/tests/factories/2024/class.factory'
import { featureFactory } from '@/tests/factories/2024/feature.factory'
import { levelFactory } from '@/tests/factories/2024/level.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('class')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(ClassModel)
setupModelCleanup(Level2024Model)
setupModelCleanup(Feature2024Model)

describe('ClassController', () => {
  describe('index', () => {
    it('returns a list of classes', async () => {
      const classesData = classFactory.buildList(3)
      await ClassModel.insertMany(classesData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await ClassController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const classesData = [
        classFactory.build({ name: 'Barbarian' }),
        classFactory.build({ name: 'Wizard' })
      ]
      await ClassModel.insertMany(classesData)

      const request = createRequest({ query: { name: 'Barbarian' } })
      const response = createResponse()

      await ClassController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Barbarian')
    })
  })

  describe('show', () => {
    it('returns a single class when found', async () => {
      const classData = classFactory.build({
        index: 'barbarian',
        name: 'Barbarian'
      })
      await ClassModel.insertMany([classData])

      const request = createRequest({ params: { index: 'barbarian' } })
      const response = createResponse()

      await ClassController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('barbarian')
      expect(responseData.name).toBe('Barbarian')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the class is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await ClassController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })

  describe('showLevelsForClass', () => {
    const classIndex = 'barbarian'
    const classUrl = `/api/2024/classes/${classIndex}`

    it('returns base levels for a class, excluding subclass-specific levels', async () => {
      const baseLevels = levelFactory.buildList(5, { class: { index: classIndex, name: 'Barbarian', url: classUrl } })
      const subclassLevel = levelFactory.build({
        class: { index: classIndex, name: 'Barbarian', url: classUrl },
        subclass: { index: 'path-of-the-berserker', name: 'Path of the Berserker', url: '/api/2024/subclasses/path-of-the-berserker' }
      })
      await Level2024Model.insertMany([...baseLevels, subclassLevel])

      const request = createRequest({ query: {}, params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showLevelsForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveLength(5)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('includes subclass levels matching the subclass query param', async () => {
      const subclassUrl = '/api/2024/subclasses/path-of-the-berserker'
      const baseLevels = levelFactory.buildList(2, {
        class: { index: classIndex, name: 'Barbarian', url: classUrl }
      })
      const subclassLevel = levelFactory.build({
        class: { index: classIndex, name: 'Barbarian', url: classUrl },
        subclass: { index: 'path-of-the-berserker', name: 'Path of the Berserker', url: subclassUrl }
      })
      await Level2024Model.insertMany([...baseLevels, subclassLevel])

      const request = createRequest({
        query: { subclass: 'path-of-the-berserker' },
        params: { index: classIndex }
      })
      const response = createResponse()

      await ClassController.showLevelsForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveLength(3)
    })

    it('returns 404 if the class has no levels', async () => {
      const request = createRequest({ query: {}, params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showLevelsForClass(request, response, mockNext)

      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
    })

    it('handles database errors', async () => {
      const request = createRequest({ query: {}, params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Level find failed')
      vi.spyOn(Level2024Model, 'find').mockImplementationOnce(
        () => ({ sort: vi.fn().mockRejectedValueOnce(error) }) as any
      )

      await ClassController.showLevelsForClass(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showLevelForClass', () => {
    const classIndex = 'barbarian'
    const classUrl = `/api/2024/classes/${classIndex}`
    const targetLevel = 3

    it('returns a specific level for a class', async () => {
      const levelData = levelFactory.build({
        level: targetLevel,
        class: { index: classIndex, name: 'Barbarian', url: classUrl }
      })
      await Level2024Model.insertMany([levelData])

      const request = createRequest({ params: { index: classIndex, level: String(targetLevel) } })
      const response = createResponse()

      await ClassController.showLevelForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toMatchObject({ level: targetLevel, index: levelData.index })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the level is not found', async () => {
      const request = createRequest({ params: { index: classIndex, level: '10' } })
      const response = createResponse()

      await ClassController.showLevelForClass(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
    })

    it('returns 400 for an invalid level parameter', async () => {
      const request = createRequest({ params: { index: classIndex, level: 'invalid' } })
      const response = createResponse()

      await ClassController.showLevelForClass(request, response, mockNext)

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
    })

    it('handles database errors', async () => {
      const request = createRequest({ params: { index: classIndex, level: String(targetLevel) } })
      const response = createResponse()
      const error = new Error('Level findOne failed')
      vi.spyOn(Level2024Model, 'findOne').mockRejectedValueOnce(error)

      await ClassController.showLevelForClass(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('showFeaturesForClassAndLevel', () => {
    const classIndex = 'barbarian'
    const classUrl = `/api/2024/classes/${classIndex}`
    const targetLevel = 3

    it('returns features gained at a specific class level', async () => {
      const matchingFeature = featureFactory.build({
        class: { index: classIndex, name: 'Barbarian', url: classUrl },
        level: { index: `${classIndex}-${targetLevel}`, name: `Barbarian ${targetLevel}`, url: `${classUrl}/levels/${targetLevel}` }
      })
      const otherFeature = featureFactory.build({
        class: { index: classIndex, name: 'Barbarian', url: classUrl },
        level: { index: `${classIndex}-1`, name: 'Barbarian 1', url: `${classUrl}/levels/1` }
      })
      await Feature2024Model.insertMany([matchingFeature, otherFeature])

      const request = createRequest({ params: { index: classIndex, level: String(targetLevel) } })
      const response = createResponse()

      await ClassController.showFeaturesForClassAndLevel(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].index).toBe(matchingFeature.index)
    })

    it('does not confuse level 1 with level 11', async () => {
      const feature11 = featureFactory.build({
        class: { index: classIndex, name: 'Barbarian', url: classUrl },
        level: { index: `${classIndex}-11`, name: 'Barbarian 11', url: `${classUrl}/levels/11` }
      })
      await Feature2024Model.insertMany([feature11])

      const request = createRequest({ params: { index: classIndex, level: '1' } })
      const response = createResponse()

      await ClassController.showFeaturesForClassAndLevel(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
    })

    it('handles database errors', async () => {
      const request = createRequest({ params: { index: classIndex, level: String(targetLevel) } })
      const response = createResponse()
      const error = new Error('Feature find failed')
      vi.spyOn(Feature2024Model, 'find').mockImplementationOnce(
        () => ({ select: vi.fn().mockReturnThis(), sort: vi.fn().mockRejectedValueOnce(error) }) as any
      )

      await ClassController.showFeaturesForClassAndLevel(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
