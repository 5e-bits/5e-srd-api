import { NextFunction, Request, Response } from 'express'

import { parseRequest } from '@/controllers/parseRequest'
import SimpleController from '@/controllers/simpleController'
import Proficiency from '@/models/2014/proficiency'
import Subrace from '@/models/2014/subrace'
import Trait from '@/models/2014/trait'
import { ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'
import { applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(Subrace)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showTraitsForSubrace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
    if (validatedParams === undefined) return
    const { index } = validatedParams
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/subraces/' + index
    const data = await Trait.find({ 'subraces.url': urlString }).select({
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

export const showProficienciesForSubrace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
    if (validatedParams === undefined) return
    const { index } = validatedParams
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/subraces/' + index

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
