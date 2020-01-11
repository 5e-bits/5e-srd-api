const router = require('express').Router();
const RaceController = require('../../controllers/api/raceController');

router.get('/', RaceController.index);
router.get('/:index', RaceController.show);

router.get('/:index/subraces', RaceController.showSubracesForRace);

router.get('/:index/traits', RaceController.showTraitsForRace);

module.exports = router;
