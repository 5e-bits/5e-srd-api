import * as express from 'express'

import * as SubclassController from '@/controllers/api/2014/subclassController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SubclassController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  SubclassController.show(req, res, next)
})

router.get('/:index/features', SubclassController.showFeaturesForSubclass)

router.get('/:index/levels/:level/features', SubclassController.showFeaturesForSubclassAndLevel)
router.get('/:index/levels/:level', SubclassController.showLevelForSubclass)
router.get('/:index/levels', SubclassController.showLevelsForSubclass)

export default router
