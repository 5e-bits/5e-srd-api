import { NextFunction, Request, Response } from 'express'

import SimpleController from '@/controllers/simpleController'
import ClassModel from '@/models/2024/class'
import Feature2024Model from '@/models/2024/feature'
import Level2024Model from '@/models/2024/level'
import { ClassLevelsQuerySchema, LevelParamsSchema, ShowParamsSchema } from '@/schemas/schemas'
import { escapeRegExp, ResourceList } from '@/util'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(ClassModel)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showLevelsForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    const validatedQuery = ClassLevelsQuerySchema.safeParse(req.query)

    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }

    const { index } = validatedParams.data
    const { subclass } = validatedQuery.data
    const lang = req.lang ?? 'en'
    const classUrl = '/api/2024/classes/' + index

    const searchQueries: Record<string, unknown> = {
      'class.url': classUrl,
      $or: [{ subclass: null }]
    }

    if (subclass !== undefined) {
      ;(searchQueries.$or as unknown[]).push({
        'subclass.url': { $regex: new RegExp(escapeRegExp(subclass), 'i') }
      })
    }

    const data = await Level2024Model.find(searchQueries).sort({ level: 'asc' })
    if (data.length === 0) {
      return res.status(404).json({ error: 'Not found' })
    }

    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2024-levels',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}

export const showLevelForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = LevelParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index, level } = validatedParams.data
    const lang = req.lang ?? 'en'
    const classUrl = '/api/2024/classes/' + index

    const data = await Level2024Model.findOne({ 'class.url': classUrl, level, subclass: null })
    if (!data) return next()

    const plain = data.toObject()
    const translated = await applyTranslation(plain as any, '2024-levels', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}

export const showFeaturesForClassAndLevel = async (
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
    const lang = req.lang ?? 'en'
    const classUrl = '/api/2024/classes/' + index

    const data = await Feature2024Model.find({
      'class.url': classUrl,
      'level.url': { $regex: new RegExp('/levels/' + level + '$') }
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ url: 'asc' })

    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2024-features',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}
