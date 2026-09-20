import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import { localeController } from '@/controllers/api/localeController'
import Locale2014Model from '@/models/2014/locale'
import Locale2024Model from '@/models/2024/locale'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

setupIsolatedDatabase(generateUniqueDbUri('locale'))
teardownIsolatedDatabase()
setupModelCleanup(Locale2014Model)
setupModelCleanup(Locale2024Model)

const localeData = [
  { lang: 'de', updated_at: '2024-01-01' },
  { lang: 'fr', updated_at: '2024-01-01' }
]

describe.each([
  ['2014', Locale2014Model],
  ['2024', Locale2024Model]
] as const)('localeController (%s)', (year, LocaleModel) => {
  const { indexLocales, showLocale } = localeController(year, LocaleModel)

  describe('indexLocales', () => {
    it('returns a list of locales', async () => {
      await LocaleModel.insertMany(localeData)
      const response = createResponse()

      await indexLocales(createRequest(), response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          { lang: 'de', url: `/api/${year}/locales/de` },
          { lang: 'fr', url: `/api/${year}/locales/fr` }
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no locales exist', async () => {
      const response = createResponse()

      await indexLocales(createRequest(), response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('showLocale', () => {
    it('returns a single locale when found', async () => {
      await LocaleModel.insertMany(localeData)
      const request = createRequest({ params: { lang: 'fr' } })
      const response = createResponse()

      await showLocale(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual({
        lang: 'fr',
        url: `/api/${year}/locales/fr`
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when locale is not found', async () => {
      const request = createRequest({ params: { lang: 'xx' } })
      const response = createResponse()
      mockNext.mockClear()

      await showLocale(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('forwards database errors to next', async () => {
      const error = new Error('Database findOne failed')
      vi.spyOn(LocaleModel, 'findOne').mockRejectedValueOnce(error)
      mockNext.mockClear()

      await showLocale(createRequest({ params: { lang: 'de' } }), createResponse(), mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
