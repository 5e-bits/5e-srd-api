import * as express from 'express';

import BackgroundController from '../../controllers/api/backgroundController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  BackgroundController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  BackgroundController.show(req, res, next);
});

export default router;
