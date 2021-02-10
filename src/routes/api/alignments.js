const router = require('express').Router();
const AlignmentController = require('../../controllers/api/alignmentController');

router.get('/', function(req, res, next) {
    AlignmentController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
    AlignmentController.show(req, res, next);
});

module.exports = router;
