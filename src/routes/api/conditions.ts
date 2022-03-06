import * as express from 'express';
const router = express.Router();
import ConditionController from '../../controllers/api/conditionController';

router.get('/', function(req: any, res: any, next: any) {
  ConditionController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  ConditionController.show(req, res, next);
});
export default router;
