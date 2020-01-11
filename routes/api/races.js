const router = require('express').Router();
const RaceController = require('../../controllers/api/raceController');

router.get('/', RaceController.index);
router.get('/:index', RaceController.show);

router.get('/:index/subraces', RaceController.showSubracesForRace);

module.exports = router;
