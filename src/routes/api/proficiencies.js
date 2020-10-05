const router = require('express').Router();
const ProficiencyController = require('../../controllers/api/proficiencyController');

router.get('/', function(req, res, next) {
  ProficiencyController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  ProficiencyController.show(req, res, next);
});

module.exports = router;
