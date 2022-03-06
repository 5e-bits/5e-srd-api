import express from 'express';
const router = express.Router();
import SubraceController from '../../controllers/api/subraceController';

router.get('/', function(req: any, res: any, next: any) {
  SubraceController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  SubraceController.show(req, res, next);
});

router.get('/:index/traits', SubraceController.showTraitsForSubrace);
router.get('/:index/proficiencies', SubraceController.showProficienciesForSubrace);

export default router;
