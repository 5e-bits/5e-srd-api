import * as express from 'express'

import SkillController from '@/controllers/api/2024/skillController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SkillController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  SkillController.show(req, res, next)
})
export default router
