const router = require('express').Router();
const EquipmentController = require('../../controllers/api/equipmentController');

router.get('/', function(req, res, next) {
  EquipmentController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  EquipmentController.show(req, res, next);
});

module.exports = router;
