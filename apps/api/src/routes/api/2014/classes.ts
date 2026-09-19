import * as express from 'express'

import * as ClassController from '@/controllers/api/2014/classController'

const router = express.Router()

router.get('/', function (req, res, next) {
  ClassController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  ClassController.show(req, res, next)
})

router.get('/:index/subclasses', function (req, res, next) {
  ClassController.showSubclassesForClass(req, res, next)
})
router.get('/:index/starting-equipment', function (req, res, next) {
  ClassController.showStartingEquipmentForClass(req, res, next)
})
router.get('/:index/spellcasting', function (req, res, next) {
  ClassController.showSpellcastingForClass(req, res, next)
})
router.get('/:index/spells', function (req, res, next) {
  ClassController.showSpellsForClass(req, res, next)
})
router.get('/:index/features', function (req, res, next) {
  ClassController.showFeaturesForClass(req, res, next)
})
router.get('/:index/proficiencies', function (req, res, next) {
  ClassController.showProficienciesForClass(req, res, next)
})
router.get('/:index/multi-classing', function (req, res, next) {
  ClassController.showMulticlassingForClass(req, res, next)
})

router.get('/:index/levels/:level/spells', function (req, res, next) {
  ClassController.showSpellsForClassAndLevel(req, res, next)
})
router.get('/:index/levels/:level/features', function (req, res, next) {
  ClassController.showFeaturesForClassAndLevel(req, res, next)
})
router.get('/:index/levels/:level', function (req, res, next) {
  ClassController.showLevelForClass(req, res, next)
})
router.get('/:index/levels', function (req, res, next) {
  ClassController.showLevelsForClass(req, res, next)
})

export default router
