const router = require('express').Router();
const StartingEquipmentController = require('../controllers/startingEquipmentController');

router.get('/', StartingEquipmentController.index);
router.get('/:index', StartingEquipmentController.show);

module.exports = router;
