import express, { Request, Response, NextFunction } from 'express'

import AbilityScoreController from '@/controllers/api/2014/abilityScoreController'

const router = express.Router()

router.get('/', function (req: Request, res: Response, next: NextFunction) {
  AbilityScoreController.index(req, res, next)
})

router.get('/:index', function (req: Request, res: Response, next: NextFunction) {
  AbilityScoreController.show(req, res, next)
})

export default router
