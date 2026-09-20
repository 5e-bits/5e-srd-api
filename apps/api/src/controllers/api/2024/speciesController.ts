import { NextFunction, Request, Response } from 'express'

import { relatedList } from '@/controllers/relatedList'
import SimpleController from '@/controllers/simpleController'
import Species2024Model from '@/models/2024/species'
import Subspecies2024Model from '@/models/2024/subspecies'
import Trait2024Model from '@/models/2024/trait'

const simpleController = new SimpleController(Species2024Model)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)

export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showSubspeciesForSpecies = relatedList({
  Model: Subspecies2024Model,
  filter: ({ index }) => ({ 'species.url': '/api/2024/species/' + index })
})

export const showTraitsForSpecies = relatedList({
  Model: Trait2024Model,
  filter: ({ index }) => ({ 'species.url': '/api/2024/species/' + index })
})
