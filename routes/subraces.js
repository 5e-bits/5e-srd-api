const router = require('express').Router();
const SubraceController = require('../controllers/subraceController');

router.get('/', SubraceController.index);
router.get('/:index', SubraceController.show);

module.exports = router;
