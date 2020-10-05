const router = require('express').Router();
const WeaponPropertyController = require('../../controllers/api/weaponPropertyController');

router.get('/', function(req, res, next) {
  WeaponPropertyController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  WeaponPropertyController.show(req, res, next);
});

module.exports = router;
