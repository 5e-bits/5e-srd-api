import * as express from 'express'

import LanguageController from '@/controllers/api/2014/languageController'

const router = express.Router()

router.get('/', function (req, res, next) {
  LanguageController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  LanguageController.show(req, res, next)
})

export default router
