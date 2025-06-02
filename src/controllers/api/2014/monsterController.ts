import { NextFunction, Request, Response } from 'express'

import Monster from '@/models/2014/monster'
import { MonsterIndexQuerySchema, ShowParamsSchema } from '@/schemas/schemas'
import { escapeRegExp, redisClient, ResourceList } from '@/util'

interface IndexQuery {
  name?: { $regex: RegExp }
  challenge_rating?: { $in: number[] }
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate query parameters
    const validatedQuery = MonsterIndexQuerySchema.safeParse(req.query)
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }
    const { name, challenge_rating } = validatedQuery.data

    const searchQueries: IndexQuery = {}
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }
    if (challenge_rating !== undefined && challenge_rating.length > 0) {
      searchQueries.challenge_rating = { $in: challenge_rating }
    }

    const redisKey = req.originalUrl
    const data = await redisClient.get(redisKey)

    if (data !== null) {
      res.status(200).json(JSON.parse(data))
    } else {
      const data = await Monster.find(searchQueries)
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

    const data = await Monster.findOne({ index: index })
    if (!data) return next()
    return res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}
