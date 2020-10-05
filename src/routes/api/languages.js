const router = require('express').Router();
const LanguageController = require('../../controllers/api/languageController');

router.get('/', function(req, res, next) {
  LanguageController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  LanguageController.show(req, res, next);
});

module.exports = router;
