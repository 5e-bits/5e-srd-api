const router = require('express').Router();
const SkillController = require('../controllers/skillController');

router.get('/', SkillController.index);
router.get('/:index', SkillController.show);

module.exports = router;
