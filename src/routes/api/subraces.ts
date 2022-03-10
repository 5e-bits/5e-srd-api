import * as express from 'express';
const router = express.Router();
import { index, show, showProficienciesForSubrace, showTraitsForSubrace } from '../../controllers/api/subraceController';

router.get('/', function (req: any, res: any, next: any) {
  index(req, res, next);
});

router.get('/:index', function (req: any, res: any, next: any) {
  show(req, res, next);
});

router.get('/:index/traits', showTraitsForSubrace);
router.get('/:index/proficiencies', showProficienciesForSubrace);

export default router;
