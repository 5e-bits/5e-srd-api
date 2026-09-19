import * as express from 'express'

import * as SpellController from '@/controllers/api/2014/spellController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SpellController.index(req, res, next)
})
router.get('/:index', function (req, res, next) {
  SpellController.show(req, res, next)
})

export default router
