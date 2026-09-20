import { ReturnModelType } from '@typegoose/typegoose'
import { NextFunction, Request, Response } from 'express'

import { ResourceList } from '@/util/data'

/** List and show handlers for the translation locales of one SRD year. */
export const localeController = (year: '2014' | '2024', Locale: ReturnModelType<any>) => ({
  indexLocales: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Locale.find().select({ lang: 1, _id: 0 }).sort({ lang: 'asc' })
      const results = data.map((d: { lang: string }) => ({
        lang: d.lang,
        url: `/api/${year}/locales/${d.lang}`
      }))
      return res.status(200).json(ResourceList(results))
    } catch (err) {
      next(err)
    }
  },

  showLocale: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lang } = req.params
      const data = await Locale.findOne({ lang })
      if (data === null) return next()
      return res.status(200).json({ lang: data.lang, url: `/api/${year}/locales/${data.lang}` })
    } catch (err) {
      next(err)
    }
  }
})
