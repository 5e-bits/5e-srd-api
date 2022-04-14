import * as express from 'express';
const router = express.Router();
import DamageTypeController from '../../controllers/api/damageTypeController';

router.get('/', function(req: any, res: any, next: any) {
  DamageTypeController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  DamageTypeController.show(req, res, next);
});

export default router;
