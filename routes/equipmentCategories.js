const router = require('express').Router();
const EquipmentCategoryController = require('../controllers/equipmentCategoryController');

router.get('/', EquipmentCategoryController.index);
router.get('/:index', EquipmentCategoryController.show);

module.exports = router;
