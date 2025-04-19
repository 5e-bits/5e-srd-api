import * as express from 'express'

import MagicSchoolController from '@/controllers/api/2014/magicSchoolController'

const router = express.Router()

router.get('/', function (req, res, next) {
  MagicSchoolController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  MagicSchoolController.show(req, res, next)
})

export default router
