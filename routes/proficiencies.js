const router = require('express').Router();
const ProficiencyController = require('../controllers/proficiencyController');

router.get('/', ProficiencyController.index);
router.get('/:index', ProficiencyController.show);

module.exports = router;
