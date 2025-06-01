import * as express from 'express'

import * as RuleController from '@/controllers/api/2014/ruleController'

const router = express.Router()

router.get('/', RuleController.index)
router.get('/:index', RuleController.show)

export default router
