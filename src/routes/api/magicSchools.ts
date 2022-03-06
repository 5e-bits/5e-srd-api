import * as express from 'express';
const router = express.Router();
import MagicSchoolController from '../../controllers/api/magicSchoolController';

router.get('/', function(req: any, res: any, next: any) {
  MagicSchoolController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  MagicSchoolController.show(req, res, next);
});

export default router;
