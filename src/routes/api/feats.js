const router = require('express').Router();
const FeatController = require('../../controllers/api/featController');

router.get('/', function(req, res, next) {
  FeatController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  FeatController.show(req, res, next);
});

module.exports = router;