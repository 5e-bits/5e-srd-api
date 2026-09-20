import { NextFunction, Request, Response } from 'express'

import { parseRequest } from '@/controllers/parseRequest'
import SimpleController from '@/controllers/simpleController'
import Feature2024Model from '@/models/2024/feature'
import Level2024Model from '@/models/2024/level'
import SubclassModel from '@/models/2024/subclass'
import { LevelParamsSchema, ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(SubclassModel)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showLevelsForSubclass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
    if (validatedParams === undefined) return
    const { index } = validatedParams
    const lang = req.lang ?? 'en'
    const subclassUrl = '/api/2024/subclasses/' + index

    const data = await Level2024Model.find({ 'subclass.url': subclassUrl }).sort({ level: 'asc' })
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

export const showLevelForSubclass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', LevelParamsSchema)
    if (validatedParams === undefined) return
    const { index, level } = validatedParams
    const lang = req.lang ?? 'en'
    const subclassUrl = '/api/2024/subclasses/' + index

    const data = await Level2024Model.findOne({ 'subclass.url': subclassUrl, level })
    if (!data) return next()

    const plain = data.toObject()
    const translated = await applyTranslation(plain as any, '2024-levels', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
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
    const validatedParams = parseRequest(req, res, 'params', LevelParamsSchema)
    if (validatedParams === undefined) return
    const { index, level } = validatedParams
    const lang = req.lang ?? 'en'
    const subclassUrl = '/api/2024/subclasses/' + index

    const data = await Feature2024Model.find({
      'subclass.url': subclassUrl,
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
