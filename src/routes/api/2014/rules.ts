import * as RuleController from '@/controllers/api/2014/ruleController'
import * as express from 'express'

const router = express.Router()

router.get('/', RuleController.index)
router.get('/:index', RuleController.show)

export default router
