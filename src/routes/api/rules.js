const router = require('express').Router();
const RuleController = require('../../controllers/api/rulesController');

router.get('/', RuleController.index);
router.get('/:index', RuleController.show);

module.exports = router;
