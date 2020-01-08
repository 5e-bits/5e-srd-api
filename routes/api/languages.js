const router = require('express').Router();
const LanguageController = require('../../controllers/api/languageController');

router.get('/', LanguageController.index);
router.get('/:index', LanguageController.show);

module.exports = router;
