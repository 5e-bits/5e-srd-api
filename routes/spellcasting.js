const router = require('express').Router();
const SpellcastingController = require('../controllers/api/spellcastingController');

router.get('/', SpellcastingController.index);
router.get('/:index', SpellcastingController.show);

module.exports = router;
