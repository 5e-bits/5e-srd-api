import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import { indexLocales, showLocale } from '@/controllers/api/2014/localeController'
import Locale2014Model from '@/models/2014/locale'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('locale-2014')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Locale2014Model)

const localeData = [
  { lang: 'de', updated_at: '2024-01-01' },
  { lang: 'fr', updated_at: '2024-01-01' }
]

describe('localeController (2014)', () => {
  describe('indexLocales', () => {
    it('returns a list of locales', async () => {
      await Locale2014Model.insertMany(localeData)
      const request = createRequest()
      const response = createResponse()

      await indexLocales(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          { lang: 'de', url: '/api/2014/locales/de' },
          { lang: 'fr', url: '/api/2014/locales/fr' }
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no locales exist', async () => {
      const request = createRequest()
      const response = createResponse()

      await indexLocales(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('showLocale', () => {
    it('returns a single locale when found', async () => {
      await Locale2014Model.insertMany(localeData)
      const request = createRequest({ params: { lang: 'fr' } })
      const response = createResponse()

      await showLocale(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData).toEqual({ lang: 'fr', url: '/api/2014/locales/fr' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when locale is not found', async () => {
      const request = createRequest({ params: { lang: 'xx' } })
      const response = createResponse()

      await showLocale(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
