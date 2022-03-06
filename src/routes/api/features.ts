import express from 'express';
const router = express.Router();
import FeatureController from '../../controllers/api/featureController';

router.get('/', function(req: any, res: any, next: any) {
  FeatureController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  FeatureController.show(req, res, next);
});

export default router;
