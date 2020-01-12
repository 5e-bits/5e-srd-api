const router = require('express').Router();
const SpellController = require('../../controllers/api/spellController');

router.get('/', SpellController.index);
router.get('/:index', SpellController.show);

module.exports = router;
