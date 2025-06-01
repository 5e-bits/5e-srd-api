import * as express from 'express'

import * as MonsterController from '@/controllers/api/2014/monsterController'

const router = express.Router()

router.get('/', MonsterController.index)
router.get('/:index', MonsterController.show)

export default router
