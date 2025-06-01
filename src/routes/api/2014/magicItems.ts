import * as express from 'express'

import * as MagicItemController from '@/controllers/api/2014/magicItemController'

const router = express.Router()

router.get('/', MagicItemController.index)
router.get('/:index', MagicItemController.show)

export default router
