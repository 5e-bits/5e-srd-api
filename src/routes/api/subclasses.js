const router = require('express').Router();
const SubclassController = require('../../controllers/api/subclassController');

router.get('/', function(req, res, next) {
  SubclassController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  SubclassController.show(req, res, next);
});

router.get('/:index/features', SubclassController.showFeaturesForSubclass);

router.get('/:index/levels/:level/features', SubclassController.showFeaturesForSubclassAndLevel);
router.get('/:index/levels/:level', SubclassController.showLevelForSubclass);
router.get('/:index/levels', SubclassController.showLevelsForSubclass);

module.exports = router;
