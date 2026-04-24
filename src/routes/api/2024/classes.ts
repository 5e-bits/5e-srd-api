import * as express from 'express'

import ClassController from '@/controllers/api/2024/classController'

const router = express.Router()

router.get('/', function (req, res, next) {
  ClassController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  ClassController.show(req, res, next)
})

export default router
