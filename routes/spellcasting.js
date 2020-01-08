const router = require('express').Router();
const SpellcastingController = require('../controllers/spellcastingController');

router.get('/', SpellcastingController.index);
router.get('/:index', SpellcastingController.show);

module.exports = router;
