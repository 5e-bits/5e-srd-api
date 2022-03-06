import * as express from 'express';
const router = express.Router();
import BackgroundController from '../../controllers/api/backgroundController';

router.get('/', function(req: any, res: any, next: any) {
  BackgroundController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  BackgroundController.show(req, res, next);
});

export default router;
