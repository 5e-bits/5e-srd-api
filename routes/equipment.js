const router = require('express').Router();
const EquipmentController = require('../controllers/api/equipmentController');

router.get('/', EquipmentController.index);
router.get('/:index', EquipmentController.show);

module.exports = router;
