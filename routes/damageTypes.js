const router = require('express').Router();
const DamageTypeController = require('../controllers/damageTypeController');

router.get('/', DamageTypeController.index);
router.get('/:index', DamageTypeController.show);

module.exports = router;
