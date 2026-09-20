import { NextFunction, Request, Response } from 'express'

import { relatedList } from '@/controllers/relatedList'
import SimpleController from '@/controllers/simpleController'
import Proficiency from '@/models/2014/proficiency'
import Race from '@/models/2014/race'
import Subrace from '@/models/2014/subrace'
import Trait from '@/models/2014/trait'

const simpleController = new SimpleController(Race)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showSubracesForRace = relatedList({
  Model: Subrace,
  filter: ({ index }) => ({ 'race.url': '/api/2014/races/' + index })
})

export const showTraitsForRace = relatedList({
  Model: Trait,
  filter: ({ index }) => ({ 'races.url': '/api/2014/races/' + index })
})

export const showProficienciesForRace = relatedList({
  Model: Proficiency,
  filter: ({ index }) => ({ 'races.url': '/api/2014/races/' + index }),
  sort: { index: 'asc' }
})
