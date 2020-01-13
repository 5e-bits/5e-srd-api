const router = require('express').Router();
const FeatureController = require('../../controllers/api/featureController');

router.get('/', FeatureController.index);
router.get('/:index', FeatureController.show);

module.exports = router;
