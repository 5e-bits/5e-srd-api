import * as express from 'express'

import PoisonController from '@/controllers/api/2024/poisonController'

const router = express.Router()

router.get('/', function (req, res, next) {
  PoisonController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  PoisonController.show(req, res, next)
})

export default router
