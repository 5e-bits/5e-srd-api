const router = require('express').Router();
const TraitController = require('../controllers/traitController');

router.get('/', TraitController.index);
router.get('/:index', TraitController.show);

module.exports = router;
