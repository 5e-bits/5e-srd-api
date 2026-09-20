import { NextFunction, Request, Response } from 'express'

import { relatedList } from '@/controllers/relatedList'
import SimpleController from '@/controllers/simpleController'
import Proficiency from '@/models/2014/proficiency'
import Subrace from '@/models/2014/subrace'
import Trait from '@/models/2014/trait'

const simpleController = new SimpleController(Subrace)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showTraitsForSubrace = relatedList({
  Model: Trait,
  filter: ({ index }) => ({ 'subraces.url': '/api/2014/subraces/' + index })
})

// The data lists subrace proficiencies under `races`, with subrace URLs.
export const showProficienciesForSubrace = relatedList({
  Model: Proficiency,
  filter: ({ index }) => ({ 'races.url': '/api/2014/subraces/' + index }),
  sort: { index: 'asc' }
})
