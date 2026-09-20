import { NextFunction, Request, Response } from 'express'

import { parseRequest } from '@/controllers/parseRequest'
import SimpleController from '@/controllers/simpleController'
import Species2024Model from '@/models/2024/species'
import Subspecies2024Model from '@/models/2024/subspecies'
import Trait2024Model from '@/models/2024/trait'
import { ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'
import { applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(Species2024Model)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)

export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showSubspeciesForSpecies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
    if (validatedParams === undefined) return
    const { index } = validatedParams
    const lang = req.lang ?? 'en'

    const urlString = '/api/2024/species/' + index

    const data = await Subspecies2024Model.find({ 'species.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0
    })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2024-subspecies',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showTraitsForSpecies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
    if (validatedParams === undefined) return
    const { index } = validatedParams
    const lang = req.lang ?? 'en'

    const urlString = '/api/2024/species/' + index

    const data = await Trait2024Model.find({ 'species.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0
    })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2024-traits',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}
