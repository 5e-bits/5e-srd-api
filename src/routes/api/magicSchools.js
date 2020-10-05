const router = require('express').Router();
const MagicSchoolController = require('../../controllers/api/magicSchoolController');

router.get('/', function(req, res, next) {
  MagicSchoolController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  MagicSchoolController.show(req, res, next);
});

module.exports = router;
