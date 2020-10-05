const router = require('express').Router();
const DamageTypeController = require('../../controllers/api/damageTypeController');

router.get('/', function(req, res, next) {
  DamageTypeController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  DamageTypeController.show(req, res, next);
});

module.exports = router;
