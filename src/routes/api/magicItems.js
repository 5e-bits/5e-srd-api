const router = require('express').Router();
const MagicItemController = require('../../controllers/api/magicItemController');

router.get('/', MagicItemController.index);
router.get('/:index', MagicItemController.show);

module.exports = router;
