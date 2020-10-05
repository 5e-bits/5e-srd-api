const router = require('express').Router();
const ClassController = require('../../controllers/api/classController');

router.get('/', function(req, res, next) {
  ClassController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  ClassController.show(req, res, next);
});

router.get('/:index/subclasses', ClassController.showSubclassesForClass);
router.get('/:index/starting-equipment', ClassController.showStartingEquipmentForClass);
router.get('/:index/spellcasting', ClassController.showSpellcastingForClass);
router.get('/:index/spells', ClassController.showSpellsForClass);
router.get('/:index/features', ClassController.showFeaturesForClass);
router.get('/:index/proficiencies', ClassController.showProficienciesForClass);

router.get('/:index/levels/:level/spells', ClassController.showSpellsForClassAndLevel);
router.get('/:index/levels/:level/features', ClassController.showFeaturesForClassAndLevel);
router.get('/:index/levels/:level', ClassController.showLevelForClass);
router.get('/:index/levels', ClassController.showLevelsForClass);

module.exports = router;
