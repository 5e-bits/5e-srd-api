import { ReturnModelType } from '@typegoose/typegoose'
import express from 'express'

import { localeController } from '@/controllers/api/localeController'

export const localeRouter = (year: '2014' | '2024', Locale: ReturnModelType<any>) => {
  const { indexLocales, showLocale } = localeController(year, Locale)
  const router = express.Router()
  router.get('/', indexLocales)
  router.get('/:lang', showLocale)
  return router
}
