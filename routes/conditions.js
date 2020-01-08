const router = require('express').Router();
const ConditionController = require('../controllers/conditionController');

router.get('/', ConditionController.index);
router.get('/:index', ConditionController.show);

module.exports = router;
