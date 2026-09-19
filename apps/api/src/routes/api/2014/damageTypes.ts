import * as express from 'express'

import DamageTypeController from '@/controllers/api/2014/damageTypeController'

const router = express.Router()

router.get('/', function (req, res, next) {
  DamageTypeController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  DamageTypeController.show(req, res, next)
})

export default router
