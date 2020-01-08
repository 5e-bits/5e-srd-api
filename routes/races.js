const router = require('express').Router();
const RaceController = require('../controllers/raceController');

router.get('/', RaceController.index);
router.get('/:index', RaceController.show);

module.exports = router;
