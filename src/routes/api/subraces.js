const router = require('express').Router();
const SubraceController = require('../../controllers/api/subraceController');

router.get('/', function(req, res, next) {
  SubraceController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  SubraceController.show(req, res, next);
});

router.get('/:index/traits', SubraceController.showTraitsForSubrace);
router.get('/:index/proficiencies', SubraceController.showProficienciesForSubrace);

module.exports = router;
