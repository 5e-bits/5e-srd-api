import * as express from 'express'

import * as ClassController from '@/controllers/api/2024/classController'

const router = express.Router()

router.get('/', function (req, res, next) {
  ClassController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  ClassController.show(req, res, next)
})

router.get('/:index/spells', function (req, res, next) {
  ClassController.showSpellsForClass(req, res, next)
})

router.get('/:index/levels/:level/features', function (req, res, next) {
  ClassController.showFeaturesForClassAndLevel(req, res, next)
})
router.get('/:index/levels/:level/spells', function (req, res, next) {
  ClassController.showSpellsForClassAndLevel(req, res, next)
})
router.get('/:index/levels/:level', function (req, res, next) {
  ClassController.showLevelForClass(req, res, next)
})
router.get('/:index/levels', function (req, res, next) {
  ClassController.showLevelsForClass(req, res, next)
})

export default router
