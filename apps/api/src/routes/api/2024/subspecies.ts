import * as express from 'express'

import * as SubspeciesController from '@/controllers/api/2024/subspeciesController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SubspeciesController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  SubspeciesController.show(req, res, next)
})

router.get('/:index/traits', function (req, res, next) {
  SubspeciesController.showTraitsForSubspecies(req, res, next)
})

export default router
