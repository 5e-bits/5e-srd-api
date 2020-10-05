const router = require('express').Router();
const TraitController = require('../../controllers/api/traitController');

router.get('/', function(req, res, next) {
  TraitController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  TraitController.show(req, res, next);
});

module.exports = router;
