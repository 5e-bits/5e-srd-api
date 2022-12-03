import * as express from 'express';

import ConditionController from '../../controllers/api/conditionController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  ConditionController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  ConditionController.show(req, res, next);
});
export default router;
