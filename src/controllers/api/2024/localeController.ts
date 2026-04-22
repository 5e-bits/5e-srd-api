import { NextFunction, Request, Response } from 'express'

import Locale2024Model from '@/models/2024/locale'
import { ResourceList } from '@/util/data'

export async function indexLocales(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await Locale2024Model.find().select({ lang: 1, _id: 0 }).sort({ lang: 'asc' })
    const results = data.map((d: any) => ({
      lang: d.lang,
      url: `/api/2024/locales/${d.lang}`
    }))
    return res.status(200).json(ResourceList(results))
  } catch (err) {
    next(err)
  }
}

export async function showLocale(req: Request, res: Response, next: NextFunction) {
  try {
    const { lang } = req.params
    const data = await Locale2024Model.findOne({ lang })
    if (data === null) return next()
    return res.status(200).json({ lang: data.lang, url: `/api/2024/locales/${data.lang}` })
  } catch (err) {
    next(err)
  }
}
