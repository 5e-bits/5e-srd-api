const router = require('express').Router();
const EquipmentController = require('../controllers/equipmentController');

router.get('/', EquipmentController.index);
router.get('/:index', EquipmentController.show);

module.exports = router;
