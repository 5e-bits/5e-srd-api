import { NextFunction, Request, Response } from 'express'

import Spell2024Model from '@/models/2024/spell'
import { ShowParamsSchema, SpellIndexQuerySchema } from '@/schemas/schemas'
import { escapeRegExp, ResourceList } from '@/util'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

interface IndexQuery {
  name?: { $regex: RegExp }
  level?: { $in: number[] }
  'school.name'?: { $in: RegExp[] }
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = SpellIndexQuerySchema.safeParse(req.query)
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }
    const { name, level, school } = validatedQuery.data
    const lang = req.lang ?? 'en'

    const searchQueries: IndexQuery = {}
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }

    if (level !== undefined) {
      searchQueries.level = { $in: level }
    }

    if (school !== undefined) {
      const schoolRegex = school.map((s) => new RegExp(escapeRegExp(s), 'i'))
      searchQueries['school.name'] = { $in: schoolRegex }
    }

    const data = await Spell2024Model.find(searchQueries)
      .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject?.() ?? d),
      '2024-spells',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const data = await Spell2024Model.findOne({ index })
    if (!data) return next()

    const plain = (data.toObject?.() ?? data) as unknown as Record<string, unknown>
    const translated = await applyTranslation(plain, '2024-spells', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}
