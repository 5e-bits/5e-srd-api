import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import SkillController from '@/controllers/api/2014/skillController'
import SkillModel from '@/models/2014/skill' // Use Model suffix
import { skillFactory } from '@/tests/factories/2014/skill.factory' // Updated path
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('skill')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(SkillModel)

describe('SkillController', () => {
  describe('index', () => {
    it('returns a list of skills', async () => {
      // Arrange
      const skillsData = skillFactory.buildList(3)
      await SkillModel.insertMany(skillsData)
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
      const request = createRequest({ query: {} })
      const response = createResponse()

      await SkillController.index(request, response, mockNext)

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
      await SkillModel.insertMany([skillData])
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
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await SkillController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200) // Passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Default 404 handling
    })
  })
})
