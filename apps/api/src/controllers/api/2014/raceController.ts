import { NextFunction, Request, Response } from 'express'

import SimpleController from '@/controllers/simpleController'
import Proficiency from '@/models/2014/proficiency'
import Race from '@/models/2014/race'
import Subrace from '@/models/2014/subrace'
import Trait from '@/models/2014/trait'
import { ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'
import { applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(Race)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showSubracesForRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/races/' + index

    const data = await Subrace.find({ 'race.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0
    })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-subraces',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showTraitsForRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/races/' + index

    const data = await Trait.find({ 'races.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0
    })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-traits',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showProficienciesForRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/races/' + index

    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-proficiencies',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}
