import { NextFunction, Request, Response } from 'express'

import MagicItem from '@/models/2014/magicItem'
import { NameQuerySchema, ShowParamsSchema } from '@/schemas/schemas'
import { escapeRegExp, redisClient, ResourceList } from '@/util'

interface IndexQuery {
  name?: { $regex: RegExp }
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate query parameters
    const validatedQuery = NameQuerySchema.safeParse(req.query)
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }
    const { name } = validatedQuery.data

    const searchQueries: IndexQuery = {}
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }

    const redisKey = req.originalUrl
    const data = await redisClient.get(redisKey)

    if (data !== null && data !== undefined && data !== '') {
      res.status(200).json(JSON.parse(data))
    } else {
      const data = await MagicItem.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' })
      const jsonData = ResourceList(data)
      redisClient.set(redisKey, JSON.stringify(jsonData))
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

    const data = await MagicItem.findOne({ index: index })
    if (data === null || data === undefined) return next()
    return res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}
