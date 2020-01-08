const router = require('express').Router();
const AbilityScoreController = require('../controllers/abilityScoreController');

router.get('/', AbilityScoreController.index);
router.get('/:index', AbilityScoreController.show);

module.exports = router;
