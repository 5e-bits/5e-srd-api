import { NextFunction, Request, Response } from 'express'

import { relatedList } from '@/controllers/relatedList'
import SimpleController from '@/controllers/simpleController'
import Subspecies2024Model from '@/models/2024/subspecies'
import Trait2024Model from '@/models/2024/trait'

const simpleController = new SimpleController(Subspecies2024Model)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)

export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showTraitsForSubspecies = relatedList({
  Model: Trait2024Model,
  filter: ({ index }) => ({ 'subspecies.url': '/api/2024/subspecies/' + index })
})
