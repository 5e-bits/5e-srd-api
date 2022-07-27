import * as express from 'express';

import DamageTypeController from '../../controllers/api/damageTypeController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  DamageTypeController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  DamageTypeController.show(req, res, next);
});

export default router;
