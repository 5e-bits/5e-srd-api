import * as express from 'express'

import SubclassController from '@/controllers/api/2024/subclassController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SubclassController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  SubclassController.show(req, res, next)
})

export default router
