const router = require('express').Router();
const FeatureController = require('../../controllers/api/featureController');

router.get('/', FeatureController.index);
router.get('/:index', FeatureController.show);

// TODO: This doesn't make any sense here and should move to class
router.get('/:index/level/:level', FeatureController.showForLevel);

module.exports = router;
