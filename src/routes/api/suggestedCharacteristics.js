const router = require('express').Router();
const SuggestedCharacteristicsController = require('../../controllers/api/suggestedCharacteristicsController');

router.get('/', function(req, res, next) {
    SuggestedCharacteristicsController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
    SuggestedCharacteristicsController.show(req, res, next);
});

module.exports = router;
