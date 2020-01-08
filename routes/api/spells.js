const router = require('express').Router();
const SpellController = require('../../controllers/api/spellController');

router.get('/', SpellController.index);
router.get('/:index', SpellController.show);

// TODO: This doesn't make sense here and should be under class
router.get('/:index/level/:level', SpellController.showSpellsForClassLevel);

module.exports = router;
