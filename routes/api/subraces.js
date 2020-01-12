const router = require('express').Router();
const SubraceController = require('../../controllers/api/subraceController');

router.get('/', SubraceController.index);
router.get('/:index', SubraceController.show);

router.get('/:index/traits', SubraceController.showTraitsForSubrace);
router.get('/:index/proficiencies', SubraceController.showProficienciesForSubrace);

module.exports = router;
