import * as express from 'express';

import ConditionController from '../../controllers/api/conditionController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  ConditionController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  ConditionController.show(req, res, next);
});
export default router;
