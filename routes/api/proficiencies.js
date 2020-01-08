const router = require('express').Router();
const ProficiencyController = require('../../controllers/api/proficiencyController');

router.get('/', ProficiencyController.index);
router.get('/:index', ProficiencyController.show);

module.exports = router;
