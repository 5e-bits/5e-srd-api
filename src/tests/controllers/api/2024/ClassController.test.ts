import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import ClassController from '@/controllers/api/2024/classController'
import ClassModel from '@/models/2024/class'
import { classFactory } from '@/tests/factories/2024/class.factory'
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
})
