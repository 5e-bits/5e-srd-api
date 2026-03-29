import { NextFunction, Request, Response } from 'express'

import SimpleController from '@/controllers/simpleController'
import Species2024Model from '@/models/2024/species'
import Subspecies2024Model from '@/models/2024/subspecies'
import Trait2024Model from '@/models/2024/trait'
import { ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'

const simpleController = new SimpleController(Species2024Model)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)

export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showSubspeciesForSpecies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data

    const urlString = '/api/2024/species/' + index

    const data = await Subspecies2024Model.find({ 'species.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0
    })
    return res.status(200).json(ResourceList(data))
  } catch (err) {
    next(err)
  }
}

export const showTraitsForSpecies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data

    const urlString = '/api/2024/species/' + index

    const data = await Trait2024Model.find({ 'species.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0
    })
    return res.status(200).json(ResourceList(data))
  } catch (err) {
    next(err)
  }
}
