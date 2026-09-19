import { NextFunction, Request, Response } from 'express'

import Spell from '@/models/2014/spell'
import { ShowParamsSchema, SpellIndexQuerySchema } from '@/schemas/schemas'
import { escapeRegExp, redisClient, ResourceList } from '@/util'
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

    const redisKey = req.originalUrl
    const cached = await redisClient.get(redisKey)

    if (cached !== null) {
      return res.status(200).json(JSON.parse(cached))
    } else {
      const data = await Spell.find(searchQueries)
        .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' })
      const plain = data.map((d: any) => d.toObject?.() ?? d)
      const { docs: translated, wasTranslated } = await applyTranslationToList(
        plain,
        '2014-spells',
        lang
      )
      const jsonData = ResourceList(translated)
      redisClient.set(redisKey, JSON.stringify(jsonData))
      res.setHeader('Content-Language', wasTranslated ? lang : 'en')
      return res.status(200).json(jsonData)
    }
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

    const data = await Spell.findOne({ index: index })
    if (!data) return next()

    const plain = (data.toObject?.() ?? data) as unknown as Record<string, unknown>
    const translated = await applyTranslation(plain, '2014-spells', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}
