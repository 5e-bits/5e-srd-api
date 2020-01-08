const router = require('express').Router();
const ClassController = require('../controllers/classController');

router.get('/', ClassController.index);
router.get('/:index', ClassController.show);

router.get('/:index/levels', ClassController.showLevelsForClass);
router.get('/:index/levels/:level', ClassController.showLevelForClass);

module.exports = router;
