const router = require('express').Router();
const ClassController = require('../../controllers/api/classController');

router.get('/', ClassController.index);
router.get('/:index', ClassController.show);

router.get('/:index/subclasses', ClassController.showSubclassesForClass);

router.get('/:index/levels/:level', ClassController.showLevelForClass);
router.get('/:index/levels', ClassController.showLevelsForClass);

module.exports = router;
