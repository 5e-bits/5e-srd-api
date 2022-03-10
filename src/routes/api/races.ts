import * as express from 'express';
const router = express.Router();
import * as RaceController from '../../controllers/api/raceController';

router.get('/', function (req: any, res: any, next: any) {
  RaceController.index(req, res, next);
});

router.get('/:index', function (req: any, res: any, next: any) {
  RaceController.show(req, res, next);
});

router.get('/:index/subraces', RaceController.showSubracesForRace);
router.get('/:index/proficiencies', RaceController.showProficienciesForRace);
router.get('/:index/traits', RaceController.showTraitsForRace);

export default router;
