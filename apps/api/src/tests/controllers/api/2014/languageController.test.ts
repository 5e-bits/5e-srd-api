import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import LanguageController from '@/controllers/api/2014/languageController'
import LanguageModel from '@/models/2014/language'
import { languageFactory } from '@/tests/factories/2014/language.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('language')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(LanguageModel)

describe('LanguageController', () => {
  describe('index', () => {
    it('returns a list of languages', async () => {
      const languagesData = languageFactory.buildList(3)
      const languageDocs = languagesData.map((data) => new LanguageModel(data))
      await LanguageModel.insertMany(languageDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await LanguageController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: languagesData[0].index, name: languagesData[0].name }),
          expect.objectContaining({ index: languagesData[1].index, name: languagesData[1].name }),
          expect.objectContaining({ index: languagesData[2].index, name: languagesData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no languages exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await LanguageController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single language when found', async () => {
      const languageData = languageFactory.build({ index: 'common', name: 'Common' })
      await LanguageModel.insertMany([languageData])

      const request = createRequest({ params: { index: 'common' } })
      const response = createResponse()

      await LanguageController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('common')
      expect(responseData.name).toBe('Common')
      expect(responseData.script).toEqual(languageData.script)
      expect(responseData.type).toEqual(languageData.type)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the language is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await LanguageController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
