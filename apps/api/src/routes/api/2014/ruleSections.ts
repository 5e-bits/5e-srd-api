import * as express from 'express'

import * as RuleSectionController from '@/controllers/api/2014/ruleSectionController'

const router = express.Router()

router.get('/', function (req, res, next) {
  RuleSectionController.index(req, res, next)
})
router.get('/:index', function (req, res, next) {
  RuleSectionController.show(req, res, next)
})

export default router
