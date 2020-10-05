const router = require('express').Router();
const EquipmentCategoryController = require('../../controllers/api/equipmentCategoryController');

router.get('/', function(req, res, next) {
  EquipmentCategoryController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  EquipmentCategoryController.show(req, res, next);
});

module.exports = router;
