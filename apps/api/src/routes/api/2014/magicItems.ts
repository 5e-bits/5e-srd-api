import * as express from 'express'

import * as MagicItemController from '@/controllers/api/2014/magicItemController'

const router = express.Router()

router.get('/', function (req, res, next) {
  MagicItemController.index(req, res, next)
})
router.get('/:index', function (req, res, next) {
  MagicItemController.show(req, res, next)
})

export default router
