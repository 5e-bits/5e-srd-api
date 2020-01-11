const router = require('express').Router();
const SubclassController = require('../../controllers/api/subclassController');

router.get('/', SubclassController.index);
router.get('/:index', SubclassController.show);

router.use('/:index/levels/:level', SubclassController.showLevelForSubclass);
router.use('/:index/levels', SubclassController.showLevelsForSubclass);

module.exports = router;
