import * as express from 'express';
const router = express.Router();
import { index, show } from '../../controllers/api/abilityScoreController';

router.get('/', function(req: any, res: any, next: any) {
  index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  show(req, res, next);
});

export default router;
