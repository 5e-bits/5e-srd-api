import * as express from 'express'

import AlignmentController from '@/controllers/api/2014/alignmentController'

const router = express.Router()

router.get('/', function (req, res, next) {
  AlignmentController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  AlignmentController.show(req, res, next)
})

export default router
