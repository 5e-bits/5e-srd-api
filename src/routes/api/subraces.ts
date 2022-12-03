import * as SubraceController from '../../controllers/api/subraceController.js';
import * as express from 'express';

const router = express.Router();

router.get('/', function(req, res, next) {
  SubraceController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  SubraceController.show(req, res, next);
});

router.get('/:index/traits', SubraceController.showTraitsForSubrace);
router.get('/:index/proficiencies', SubraceController.showProficienciesForSubrace);

export default router;
