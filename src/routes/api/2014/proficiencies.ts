import * as express from 'express'

import ProficiencyController from '@/controllers/api/2014/proficiencyController'

const router = express.Router()

router.get('/', function (req, res, next) {
  ProficiencyController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  ProficiencyController.show(req, res, next)
})

export default router
