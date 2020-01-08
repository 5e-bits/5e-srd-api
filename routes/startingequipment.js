const router = require('express').Router();
const StartingEquipmentController = require('../controllers/api/startingEquipmentController');

router.get('/', StartingEquipmentController.index);
router.get('/:index', StartingEquipmentController.show);

module.exports = router;
