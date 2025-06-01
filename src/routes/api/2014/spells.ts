import * as express from 'express'

import * as SpellController from '@/controllers/api/2014/spellController'

const router = express.Router()

router.get('/', SpellController.index)
router.get('/:index', SpellController.show)

export default router
