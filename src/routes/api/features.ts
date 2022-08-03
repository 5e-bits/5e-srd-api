import * as express from 'express';

import FeatureController from '../../controllers/api/featureController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  FeatureController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  FeatureController.show(req, res, next);
});

export default router;
