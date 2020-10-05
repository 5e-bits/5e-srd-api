const router = require('express').Router();
const FeatureController = require('../../controllers/api/featureController');

router.get('/', function(req, res, next) {
  FeatureController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  FeatureController.show(req, res, next);
});

module.exports = router;
