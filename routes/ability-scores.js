const router = require('express').Router();
const AbilityScoreController = require('../controllers/abilityScoreController');

router.get('/', AbilityScoreController.indexAbilityScores);
router.get('/:index', AbilityScoreController.showAbilityScore);

module.exports = router;
