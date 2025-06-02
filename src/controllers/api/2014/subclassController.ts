import { NextFunction, Request, Response } from 'express'

import SimpleController from '@/controllers/simpleController'
import Feature from '@/models/2014/feature'
import Level from '@/models/2014/level'
import Subclass from '@/models/2014/subclass'
import { LevelParamsSchema, ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'

const simpleController = new SimpleController(Subclass)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showLevelsForSubclass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data

    const urlString = '/api/2014/subclasses/' + index

    const data = await Level.find({ 'subclass.url': urlString }).sort({ level: 'asc' })
    return res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

export const showLevelForSubclass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = LevelParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index, level } = validatedParams.data

    const urlString = '/api/2014/subclasses/' + index + '/levels/' + level

    const data = await Level.findOne({ url: urlString })
    if (!data) return next()
    return res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

export const showFeaturesForSubclass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data

    const urlString = '/api/2014/subclasses/' + index

    const data = await Feature.find({
      'subclass.url': urlString
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    return res.status(200).json(ResourceList(data))
  } catch (err) {
    next(err)
  }
}

export const showFeaturesForSubclassAndLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams = LevelParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index, level } = validatedParams.data

    const urlString = '/api/2014/subclasses/' + index

    const data = await Feature.find({
      level: level,
      'subclass.url': urlString
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    return res.status(200).json(ResourceList(data))
  } catch (err) {
    next(err)
  }
}
