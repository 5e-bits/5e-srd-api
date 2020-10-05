const router = require('express').Router();
const RaceController = require('../../controllers/api/raceController');

router.get('/', function(req, res, next) {
  RaceController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  RaceController.show(req, res, next);
});

router.get('/:index/subraces', RaceController.showSubracesForRace);
router.get('/:index/proficiencies', RaceController.showProficienciesForRace);
router.get('/:index/traits', RaceController.showTraitsForRace);

module.exports = router;
