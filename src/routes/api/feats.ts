import * as express from 'express';
const router = express.Router();
import FeatController from '../../controllers/api/featController';

router.get('/', function(req: any, res: any, next: any) {
  FeatController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  FeatController.show(req, res, next);
});

export default router;
