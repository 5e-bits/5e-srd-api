const router = require('express').Router();
const RuleSectionController = require('../../controllers/api/ruleSectionController');

router.get('/', RuleSectionController.index);
router.get('/:index', RuleSectionController.show);

module.exports = router;
