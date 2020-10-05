const router = require('express').Router();
const ConditionController = require('../../controllers/api/conditionController');

router.get('/', function(req, res, next) {
  ConditionController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  ConditionController.show(req, res, next);
});
module.exports = router;
