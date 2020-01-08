const router = require('express').Router();
const SubclassController = require('../controllers/api/subclassController');

router.get('/', SubclassController.index);
router.get('/:index', SubclassController.show);

router.use('/:index/level/:level', SubclassController.showLevelForClass);
router.use('/:index/levels', SubclassController.showLevelsForClass);

module.exports = router;
