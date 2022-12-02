import * as express from 'express';

import FeatureController from '../../controllers/api/featureController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  FeatureController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  FeatureController.show(req, res, next);
});

export default router;
