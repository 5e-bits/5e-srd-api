import { NextFunction, Request, Response } from 'express'

import Rule from '@/models/2014/rule'
import { NameDescQuerySchema, ShowParamsSchema } from '@/schemas/schemas'
import { escapeRegExp, redisClient, ResourceList } from '@/util'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

interface IndexQuery {
  name?: { $regex: RegExp }
  desc?: { $regex: RegExp }
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate query parameters
    const validatedQuery = NameDescQuerySchema.safeParse(req.query)
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }
    const { name, desc } = validatedQuery.data
    const lang = req.lang ?? 'en'

    const searchQueries: IndexQuery = {}
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }
    if (desc !== undefined) {
      searchQueries.desc = { $regex: new RegExp(escapeRegExp(desc), 'i') }
    }

    const redisKey = req.originalUrl
    const cached = await redisClient.get(redisKey)

    if (cached !== null) {
      return res.status(200).json(JSON.parse(cached))
    } else {
      const data = await Rule.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' })
      const plain = data.map((d: any) => d.toObject?.() ?? d)
      const { docs: translated, wasTranslated } = await applyTranslationToList(
        plain,
        '2014-rules',
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
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const data = await Rule.findOne({ index: index })
    if (!data) return next()

    const plain = (data.toObject?.() ?? data) as unknown as Record<string, unknown>
    const translated = await applyTranslation(plain, '2014-rules', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}
