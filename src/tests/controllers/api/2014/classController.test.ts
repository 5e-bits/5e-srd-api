import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support'

import * as ClassController from '@/controllers/api/2014/classController'
import ClassModel from '@/models/2014/class'
import FeatureModel from '@/models/2014/feature'
import LevelModel from '@/models/2014/level'
import ProficiencyModel from '@/models/2014/proficiency'
import SpellModel from '@/models/2014/spell'
import SubclassModel from '@/models/2014/subclass'

import { classFactory } from '@/tests/factories/2014/class.factory'
import { levelFactory } from '@/tests/factories/2014/level.factory'
import { subclassFactory } from '@/tests/factories/2014/subclass.factory'
import { spellFactory } from '@/tests/factories/2014/spell.factory'
import { featureFactory } from '@/tests/factories/2014/feature.factory'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'
import { apiReferenceFactory } from '@/tests/factories/2014/common.factory'

const mockNext = vi.fn(defaultMockNext)

let fileUniqueDbUri: string | undefined

beforeAll(async () => {
  const baseUri = process.env.TEST_MONGODB_URI_BASE
  if (!baseUri) {
    throw new Error('TEST_MONGODB_URI_BASE environment variable not set. Ensure globalSetup ran.')
  }
  const dbName = `test_class_${crypto.randomBytes(4).toString('hex')}`
  fileUniqueDbUri = baseUri + dbName

  await mongoose.connect(fileUniqueDbUri, {})
})

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase()
      }
    } catch (err) {
      console.error(`Error dropping database ${mongoose.connection.name}:`, err)
    }
    await mongoose.disconnect()
  }
})

beforeEach(async () => {
  vi.clearAllMocks()
  // Clear collections before each test within this file's unique DB
  await ClassModel.deleteMany({})
  await LevelModel.deleteMany({})
  await SubclassModel.deleteMany({})
  await SpellModel.deleteMany({})
  await FeatureModel.deleteMany({})
  await ProficiencyModel.deleteMany({})
})

describe('ClassController', () => {
  // === index ===
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
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: classesData[0].index,
            name: classesData[0].name,
            url: classesData[0].url
          }),
          expect.objectContaining({
            index: classesData[1].index,
            name: classesData[1].name,
            url: classesData[1].url
          }),
          expect.objectContaining({
            index: classesData[2].index,
            name: classesData[2].name,
            url: classesData[2].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles index database errors', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()
      const error = new Error('Database find failed')
      vi.spyOn(ClassModel, 'find').mockImplementationOnce(
        () =>
          ({
            select: vi.fn().mockReturnThis(),
            sort: vi.fn().mockReturnThis(),
            exec: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await ClassController.index(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty list when no classes exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()
      await ClassController.index(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual({ count: 0, results: [] })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  // === show ===
  describe('show', () => {
    const classIndex = 'barbarian'
    it('returns a single class when found', async () => {
      const classData = classFactory.build({ index: classIndex })
      await ClassModel.insertMany([classData])
      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()

      await ClassController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toMatchObject({
        index: classData.index,
        name: classData.name,
        url: classData.url
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the class is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()
      await ClassController.show(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles show database errors', async () => {
      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Database findOne failed')
      vi.spyOn(ClassModel, 'findOne').mockRejectedValueOnce(error)
      await ClassController.show(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  // === showLevelsForClass ===
  describe('showLevelsForClass', () => {
    const classIndex = 'wizard'
    const classUrl = `/api/2014/classes/${classIndex}`
    it('returns levels for a specific class', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const levelsData = levelFactory.buildList(5, {
        class: { index: classIndex, name: classData.name, url: classUrl }
      })
      await LevelModel.insertMany(levelsData)
      await LevelModel.insertMany(levelFactory.buildList(2))

      const request = createRequest({ query: {}, params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showLevelsForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toBeInstanceOf(Array)
      expect(responseData).toHaveLength(5)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if class has no levels', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const request = createRequest({ query: {}, params: { index: classIndex } })
      const response = createResponse()
      await ClassController.showLevelsForClass(request, response, mockNext)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if class index is invalid', async () => {
      const request = createRequest({ query: {}, params: { index: 'nonexistent' } })
      const response = createResponse()
      await ClassController.showLevelsForClass(request, response, mockNext)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles levels database errors', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const request = createRequest({ query: {}, params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Level find failed')
      vi.spyOn(LevelModel, 'find').mockImplementationOnce(
        () =>
          ({
            sort: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await ClassController.showLevelsForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  // === showLevelForClass ===
  describe('showLevelForClass', () => {
    const classIndex = 'wizard'
    const targetLevel = 5
    const levelUrl = `/api/2014/classes/${classIndex}/levels/${targetLevel}`

    it('returns a specific level for a class', async () => {
      const classData = classFactory.build({ index: classIndex })
      await ClassModel.insertMany([classData])
      const levelData = levelFactory.build({
        level: targetLevel,
        class: { index: classIndex, name: classData.name, url: `/api/2014/classes/${classIndex}` },
        url: levelUrl
      })
      await LevelModel.insertMany([levelData])

      const request = createRequest({ params: { index: classIndex, level: String(targetLevel) } })
      const response = createResponse()

      await ClassController.showLevelForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toMatchObject({ level: levelData.level, url: levelData.url })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the specific level is not found', async () => {
      const request = createRequest({ params: { index: classIndex, level: '10' } })
      const response = createResponse()
      await ClassController.showLevelForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles level findOne database errors', async () => {
      const request = createRequest({ params: { index: classIndex, level: String(targetLevel) } })
      const response = createResponse()
      const error = new Error('Level findOne failed')
      vi.spyOn(LevelModel, 'findOne').mockRejectedValueOnce(error)
      await ClassController.showLevelForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns 400 for invalid level parameter (non-numeric)', async () => {
      const request = createRequest({ params: { index: classIndex, level: 'invalid' } })
      const response = createResponse()
      await ClassController.showLevelForClass(request, response, mockNext)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
    })

    it('returns 400 for invalid level parameter (out of range)', async () => {
      const request = createRequest({ params: { index: classIndex, level: '21' } })
      const response = createResponse()
      await ClassController.showLevelForClass(request, response, mockNext)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response._getData()).error).toContain('Invalid path parameters')
    })
  })

  // === showSubclassesForClass ===
  describe('showSubclassesForClass', () => {
    const classIndex = 'barbarian'
    const classUrl = `/api/2014/classes/${classIndex}`
    it('returns subclasses for a specific class', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const subclassesData = subclassFactory.buildList(2, {
        class: { index: classIndex, name: classData.name, url: classUrl }
      })
      await SubclassModel.insertMany(subclassesData)
      await SubclassModel.insertMany(subclassFactory.buildList(1))

      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showSubclassesForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveProperty('count', 2)
      expect(responseData).toHaveProperty('results')
      expect(responseData.results).toHaveLength(2)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if class index is invalid', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()
      await ClassController.showSubclassesForClass(request, response, mockNext)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData()).error).toEqual('Not found')
    })

    it('handles subclass find database errors', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Subclass find failed')
      vi.spyOn(SubclassModel, 'find').mockImplementationOnce(
        () =>
          ({
            select: vi.fn().mockReturnThis(),
            sort: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await ClassController.showSubclassesForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  // === showSpellsForClass ===
  describe('showSpellsForClass', () => {
    const classIndex = 'wizard'
    const classUrl = `/api/2014/classes/${classIndex}`
    it('returns spells for a specific class', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const spellsData = spellFactory.buildList(3, {
        classes: [{ index: classIndex, name: classData.name, url: classUrl }]
      })
      await SpellModel.insertMany(spellsData)
      await SpellModel.insertMany(spellFactory.buildList(2))

      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showSpellsForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveProperty('count', 3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if class index is invalid', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()
      await ClassController.showSpellsForClass(request, response, mockNext)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles spell find database errors', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Spell find failed')
      vi.spyOn(SpellModel, 'find').mockImplementationOnce(
        () =>
          ({
            select: vi.fn().mockReturnThis(),
            sort: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await ClassController.showSpellsForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  // === showFeaturesForClass ===
  describe('showFeaturesForClass', () => {
    const classIndex = 'fighter'
    const classUrl = `/api/2014/classes/${classIndex}`
    it('returns features for a specific class', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const featuresData = featureFactory.buildList(4, {
        class: { index: classIndex, name: classData.name, url: classUrl }
      })
      await FeatureModel.insertMany(featuresData)
      await FeatureModel.insertMany(featureFactory.buildList(2))

      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showFeaturesForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveProperty('count', 4)
      expect(responseData.results).toHaveLength(4)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if class index is invalid', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()
      await ClassController.showFeaturesForClass(request, response, mockNext)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles feature find database errors', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Feature find failed')
      vi.spyOn(FeatureModel, 'find').mockImplementationOnce(
        () =>
          ({
            select: vi.fn().mockReturnThis(),
            sort: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await ClassController.showFeaturesForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  // === showProficienciesForClass ===
  describe('showProficienciesForClass', () => {
    const classIndex = 'rogue'
    const classUrl = `/api/2014/classes/${classIndex}`
    it('returns proficiencies for a specific class', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const profsData = proficiencyFactory.buildList(5, {
        classes: [{ index: classIndex, name: classData.name, url: classUrl }]
      })
      await ProficiencyModel.insertMany(profsData)
      await ProficiencyModel.insertMany(proficiencyFactory.buildList(2))

      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()

      await ClassController.showProficienciesForClass(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toHaveProperty('count', 5)
      expect(responseData.results).toHaveLength(5)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 404 if class index is invalid', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()
      await ClassController.showProficienciesForClass(request, response, mockNext)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response._getData())).toEqual({ error: 'Not found' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles proficiency find database errors', async () => {
      const classData = classFactory.build({ index: classIndex, url: classUrl })
      await ClassModel.insertMany([classData])
      const request = createRequest({ params: { index: classIndex } })
      const response = createResponse()
      const error = new Error('Proficiency find failed')
      vi.spyOn(ProficiencyModel, 'find').mockImplementationOnce(
        () =>
          ({
            select: vi.fn().mockReturnThis(),
            sort: vi.fn().mockRejectedValueOnce(error)
          }) as any
      )
      await ClassController.showProficienciesForClass(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
