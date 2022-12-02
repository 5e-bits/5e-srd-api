import * as express from 'express';

import FeatController from '../../controllers/api/featController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  FeatController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  FeatController.show(req, res, next);
});

export default router;
