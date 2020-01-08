const router = require('express').Router();
const WeaponPropertyController = require('../../controllers/api/weaponPropertyController');

router.get('/', WeaponPropertyController.index);
router.get('/:index', WeaponPropertyController.show);

module.exports = router;
