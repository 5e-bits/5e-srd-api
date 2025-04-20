import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location

import SkillModel from '@/models/2014/skill' // Use Model suffix
import SkillController from '@/controllers/api/2014/skillController'
import { skillFactory } from '@/tests/factories/2014/skill.factory' // Updated path

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
  await SkillModel.deleteMany({})
})

describe('SkillController', () => {
  describe('index', () => {
    it('returns a list of skills', async () => {
      // Arrange
      const skillsData = skillFactory.buildList(3)
      const skillDocs = skillsData.map((data) => new SkillModel(data))
      await SkillModel.insertMany(skillDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await SkillController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: skillsData[0].index, name: skillsData[0].name }),
          expect.objectContaining({ index: skillsData[1].index, name: skillsData[1].name }),
          expect.objectContaining({ index: skillsData[2].index, name: skillsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no skills exist', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await SkillController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single skill when found', async () => {
      // Arrange
      const skillData = skillFactory.build({ index: 'athletics', name: 'Athletics' })
      await SkillModel.insertMany([skillData]) // Use insertMany workaround

      const request = createRequest({ params: { index: 'athletics' } })
      const response = createResponse()

      // Act
      await SkillController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('athletics')
      expect(responseData.name).toBe('Athletics')
      expect(responseData.desc).toEqual(skillData.desc)
      // Check nested object
      expect(responseData.ability_score.index).toEqual(skillData.ability_score.index)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the skill is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await SkillController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
