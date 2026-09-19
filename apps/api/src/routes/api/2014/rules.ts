import * as express from 'express'

import * as RuleController from '@/controllers/api/2014/ruleController'

const router = express.Router()

router.get('/', function (req, res, next) {
  RuleController.index(req, res, next)
})
router.get('/:index', function (req, res, next) {
  RuleController.show(req, res, next)
})

export default router
