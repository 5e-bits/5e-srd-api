const router = require('express').Router();
const MagicSchoolController = require('../controllers/api/magicSchoolController');

router.get('/', MagicSchoolController.index);
router.get('/:index', MagicSchoolController.show);

module.exports = router;
