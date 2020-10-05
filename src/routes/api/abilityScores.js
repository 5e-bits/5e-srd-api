const router = require('express').Router();
const AbilityScoreController = require('../../controllers/api/abilityScoreController');

router.get('/', function(req, res, next) {
  AbilityScoreController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  AbilityScoreController.show(req, res, next);
});

module.exports = router;
