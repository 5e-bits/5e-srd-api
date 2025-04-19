import * as MonsterController from '@/controllers/api/2014/monsterController'
import * as express from 'express'

const router = express.Router()

router.get('/', MonsterController.index)
router.get('/:index', MonsterController.show)

export default router
