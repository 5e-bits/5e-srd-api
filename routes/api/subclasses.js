const router = require('express').Router();
const SubclassController = require('../../controllers/api/subclassController');

router.get('/', SubclassController.index);
router.get('/:index', SubclassController.show);
router.get('/:index/features', SubclassController.showFeaturesForSubclass);

router.get('/:index/levels/:level/features', SubclassController.showFeaturesForSubclassAndLevel);
router.use('/:index/levels/:level', SubclassController.showLevelForSubclass);
router.use('/:index/levels', SubclassController.showLevelsForSubclass);

module.exports = router;
