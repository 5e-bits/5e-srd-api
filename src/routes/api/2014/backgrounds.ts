import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import BackgroundController from '@/controllers/api/2014/backgroundController'

const router = express.Router()

router.get('/', function (req: Request, res: Response, next: NextFunction) {
  BackgroundController.index(req, res, next)
})

router.get('/:index', function (req: Request, res: Response, next: NextFunction) {
  BackgroundController.show(req, res, next)
})

router.put('/', function (req: Request, res: Response, next: NextFunction) {
  BackgroundController.create(req, res, next)
})

router.patch('/:index', function (req: Request, res: Response, next: NextFunction) {
  BackgroundController.update(req, res, next)
})

export default router
