import * as express from 'express'

import * as MonsterController from '@/controllers/api/2014/monsterController'

const router = express.Router()

router.get('/', function (req, res, next) {
  MonsterController.index(req, res, next)
})
router.get('/:index', function (req, res, next) {
  MonsterController.show(req, res, next)
})

export default router
